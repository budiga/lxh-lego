import { mount, VueWrapper } from '@vue/test-utils'
import Uploader from '@/components/Uploader.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
let wrapper: VueWrapper<any>
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })

const mockComponent = {
  template: '<div><slot></slot></div>'
}
const mockComponents = {
  'LoadingOutlined': mockComponent,
  'FileOutlined': mockComponent,
  'DeleteOutlined': mockComponent,
}

const setInputValue = (input: HTMLInputElement, file = testFile) => {
  const files = [file] as any
  Object.defineProperty(input, 'files', {
    value: files,
    writable: false
  })
}

describe('Uploader component', () => {
  beforeAll(() => {
    wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
      },
      global: {
        stubs: mockComponents
      }
    })
  })

  it('basic layout before uploading', () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })

  it('upload process should works fine', async () => {
    const fileInput = wrapper.get('input').element as HTMLInputElement
    const files = [testFile] as any
    Object.defineProperty(fileInput, 'files', {
      value: files,
      writable: false,
    })

    mockedAxios.post.mockResolvedValueOnce({ status: 'success' })
    wrapper.find('input').trigger('change')

    // 等uploadedFiles渲染完成，这一步是需要的，否则下面的测试不通过
    await wrapper.vm.$nextTick()

    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button span').text()).toBe('正在上传')
    // 按钮变成disabled
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
    // 列表长度变化 并有正确的class
    expect(wrapper.findAll('li').length).toBe(1)
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-loading')

    // console.log('----log1----', wrapper.html())
    await flushPromises()
    // console.log('----log2----', wrapper.html())

    expect(wrapper.get('button span').text()).toBe('点击上传')
    expect(firstItem.classes()).toContain('upload-success')
    expect(firstItem.get('.filename').text()).toBe(testFile.name)
  })

  it('should return error text when post is rejected', async () => {
    mockedAxios.post.mockRejectedValueOnce({ error: 'error' })
    wrapper.get('input').trigger('change')

    // 等uploadedFiles渲染完成
    await wrapper.vm.$nextTick()
    expect(mockedAxios.post).toHaveBeenCalledTimes(2)
    expect(wrapper.get('button span').text()).toBe('正在上传')

    await flushPromises()

    expect(wrapper.get('button span').text()).toBe('点击上传')
    // 列表长度变化 并有正确的class
    expect(wrapper.findAll('li').length).toBe(2)
    const lastItem = wrapper.get('li:last-child')
    expect(lastItem.classes()).toContain('upload-error')
    // 点击右侧删除按钮可以删除
    await lastItem.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it('should show the correct interface when using custom slot', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'dummy.url'}})
    mockedAxios.post.mockResolvedValueOnce({ data: {url: 'xyz.url'}})
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url',
      },
      slots: {
        default: '<button>Custom button</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{ uploadedData }">
          <div class="custom-loaded">{{uploadedData.url}}</div>
        </template>`
      },
      global: {
        stubs: mockComponents
      }
    })
    expect(wrapper.get('button').text()).toBe('Custom button')
    const fileInput = wrapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('dummy.url')
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('xyz.url')
  })

  afterEach(() => {
    mockedAxios.post.mockReset()
  })
})



