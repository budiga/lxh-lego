<template>
  <div class="component-file-upload">
    <div
      class="upload-area"
      :class="{'is-dragover': drag && isDragover}"
      v-on="events"
    >
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot name="uploaded" v-else-if="lastFileData && lastFileData.loaded" :uploadedData="lastFileData.data">
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      :style="{display: 'none'}"
      @change="handleFileChange"
    />
    <ul v-if="showUploadList" class="upload-list">
      <li
        v-for="file in filesList"
        :class="`uploaded-file upload-${file.status}`"
        :key="file.uid"
      >
        <img
          v-if="file.url && listType === 'picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name"
        >
        <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined/></span>
        <span v-else class="file-icon"><FileOutlined/></span>
        <span class="filename">{{file.name}}</span>
        <span class="delete-icon" @click="removeFile(file.uid)"><DeleteOutlined/></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, PropType } from 'vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'
import { last } from 'lodash-es'

type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type FileListType = 'picture' | 'text'
type CheckUpload = (file: File) => boolean | Promise<File>

export interface IUploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
  url?: any;
}
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>
    },
    drag: {
      type: Boolean,
      default: false,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<FileListType>,
      default: 'text'
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  setup(props, { emit }) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const filesList = ref<IUploadFile[]>([])
    const isDragover = ref(false)
    const isUploading = computed(() => {
      return filesList.value.some(file => file.status === 'loading')
    })
    const lastFileData = computed(() => {
      const lastFile = last(filesList.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp
        }
      }
      return false
    })

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const beforeUploadCheck = (files: FileList | null) => {
      if (files) {
        const uploadedFile = files[0]
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          if (result && result instanceof Promise) {
            result.then((processedFile) => {
              if (processedFile instanceof File) {
                addFileToList(processedFile)
              } else {
                throw new Error('should return File Object')
              }
            }).catch(e => {
              console.error(e)
            })
          } else if (result ===  true) {
            addFileToList(uploadedFile)
          }
        } else {
          addFileToList(uploadedFile)
        }
      }
    }
    const removeFile = (id: string) => {
      filesList.value = filesList.value.filter(file => file.uid === id)
    }
    const uploadFiles = () => {
      filesList.value.filter(file => file.status === 'ready').forEach(readyFile => postFile(readyFile))
    }

    let events: {[key: string]: (e: any) => void} = {
      'click': triggerUpload
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      beforeUploadCheck(target.files)
    }
    const postFile = (readyFile: IUploadFile) => {
      const formData = new FormData()
      formData.append(readyFile.name, readyFile.raw)
      readyFile.status = 'loading'
      // axios.post('http://local.test:7001/api/upload', formData, {
      axios.post(props.action, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        },
      }).then((res) => {
        readyFile.status = 'success'
        readyFile.resp = res.data
        console.log('----upload file res----', res)
        emit('success', { res: res.data, file: readyFile, list: filesList.value })
      }).catch((error) => {
        readyFile.status = 'error'
        console.log('----upload file error----', error)
        emit('fail', { error, file: readyFile, list: filesList.value })
      }).finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
    }
    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<IUploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: 'ready',
        raw: uploadedFile
      })
      if (props.listType === 'picture') {
        try {
          fileObj.url = URL.createObjectURL(uploadedFile)
        } catch (error) {
          console.log('createObjectURL error:', error)
        }
        // 方式二：通过FileReader来读取文件
        // const fileReader = new FileReader()
        // fileReader.readAsDataURL(uploadedFile)
        // fileReader.addEventListener('load', () => {
        //   fileObj.url = fileReader.result as string
        // })
      }
      filesList.value.push(fileObj)
      if (props.autoUpload) {
        postFile(fileObj)
      }
    }
    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault()
      isDragover.value = over
    }
    const handleDrop = (e: DragEvent, over?: boolean) => {
      e.preventDefault()
      isDragover.value = false
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files)
      }
    }
    if (props.drag) {
      events = {
        ...events,
        'dragover': (e: DragEvent) => { handleDrag(e, true) },
        'dragleave': (e: DragEvent) => { handleDrag(e, false) },
        'drop':  handleDrop,
      }
    }
    return {
      fileInput,
      triggerUpload,
      handleFileChange,
      isUploading,
      filesList,
      removeFile,
      lastFileData,
      handleDrag,
      events,
      isDragover,
      uploadFiles,
    }
  },
})
</script>

<style lang="scss">
.upload-area {
  width: 100px;
  height: 60px;
  border: 1px solid #999;
  border-radius: 8px;

  &.is-dragover {
    border: 1px dashed blue;
  }
}
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all .5s cubic-bezier(.55,0,.1,1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  text-align: left;
  &:first-child {
    margin-top: 10px;
  }
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>
