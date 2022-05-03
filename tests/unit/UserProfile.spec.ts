
import { mount, VueWrapper } from '@vue/test-utils'
import { message } from 'ant-design-vue'
import UserProfile from '@/components/UserProfile.vue'
import store from '@/store/index'

let wrapper: VueWrapper<any>

// 方式一： 采用jest.mock模拟第三方库
jest.mock('ant-design-vue', () => ({
  message: {
    success: jest.fn()
  },
}))
// 方式二： 采用global.provide,真实的测试vuex
// jest.mock('vuex')
// 方式三： 模拟vue-router、setTimeout
const mockedRoutes: string[] = []
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: (url: string) => mockedRoutes.push(url),
  }),
}))
const mockComponent = {
  template: '<div><slot></slot></div>',
}
const mockComponent2 = {
  template: '<div><slot></slot><slot name="overlay"></slot></div>',
}
const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'router-link': mockComponent,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent,

}

describe('UserProfile component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    wrapper = mount(UserProfile, {
      props: {
        user: { isLogin: false }
      },
      global: {
        components: globalComponents,
        provide: {
          store,
        },
      }
    })
  })

  it('shoule render login button when login is false', async () => {
    // console.log('----log----', wrapper.html())
    expect(wrapper.get('div').text()).toBe('登录')
    await wrapper.get('div').trigger('click')
    expect(message.success).toHaveBeenCalled()
    expect(store.state.user.username).toBe('lxh2')
  })
  it('shoule render login button when login is true', async () => {
    await wrapper.setProps({
      user: {
        isLogin: true,
        username: 'lxh',
      }
    })
    // console.log('----log----', wrapper.html())
    expect(wrapper.get('.user-profile-component').html()).toContain('lxh')
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy()
  })
  it('should call logout and show message, call router.push after timeout', async() => {
    await wrapper.get('.user-profile-dropdown div').trigger('click')
    expect(store.state.user.isLogin).toBeFalsy()
    expect(message.success).toHaveBeenCalledTimes(1)
    jest.runAllTimers()
    expect(mockedRoutes).toEqual(['/'])
  })
  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset()
  })
})
