<template>
  <div class="editor-page">
    <a-layout :style="{background: '#fff'}">
      <a-layout-header class="header">
        <div class="page-title">lego项目</div>
      </a-layout-header>
    </a-layout>

    <a-layout class="editor-content">
      <a-layout-sider width="300" style="background: #fff;">
        <div style="textAlign: left;">组件列表</div>
        <component-list :list="defaultTextTemplates" @onItemClick="addItem" />
        <uploder
          action="http://baidu.com/api/upload"
          drag
          listType="picture"
          :showUploadList="false"
          @success="(data) => {handleUploadSuccess()}"
          @fail="(data) => {handleUploadFail(data.file)}"
        />
      </a-layout-sider>
      <a-layout>
        画布区域
        <edit-wrapper
          v-for="component in components"
          :key="component.id"
          :id="component.id"
          @setActive="setActive"
          :active="(currentElement && currentElement.id)===component.id"
        >
          <component
            :is="component.name"
            v-bind="component.props"
          />
        </edit-wrapper>
      </a-layout>
      <a-layout-sider width="300" style="background: #fff">
        组件属性
        <props-table
          v-if="currentElement && currentElement.props"
          :props="currentElement.props"
          @change="handleChange"
        />
        <pre>
          {{currentElement && currentElement.props}}
        </pre>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
import LText from '../components/LText.vue'
import LImage from '../components/LImage.vue'
import ComponentList from '../components/ComponentsList.vue'
import EditWrapper from '../components/EditWrapper.vue'
import PropsTable from '../components/PropsTable.vue'
import defaultTextTemplates from '../defaultTemplates'
import Uploder, { IUploadFile } from '@/components/Uploader.vue'

export default defineComponent({
  components: {
    LText,
    LImage,
    ComponentList,
    EditWrapper,
    PropsTable,
    Uploder,
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)

    const addItem = (props: any) => {
      store.commit('addComponent', props)
    }
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    const handleChange = (e: any) => {
      console.log('---handle change---', e)
      store.commit('updateComponent', e)
    }
    const handleUploadSuccess = () => {
      console.log('---upload success---')
    }
    const handleUploadFail = (file: IUploadFile) => {
      console.log('---upload fail---')
      store.commit('addImgComponent', {
        src: file.url,
      })
    }

    return {
      components,
      defaultTextTemplates,
      addItem,
      setActive,
      currentElement,
      handleChange,
      handleUploadSuccess,
      handleUploadFail,
    }
  }
})
</script>

<style>
.page-title {
  color: #fff;
}
.editor-page .editor-content {
  min-height: 80vh;
}
</style>
