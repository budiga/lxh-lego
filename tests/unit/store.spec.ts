import store from '@/store/index'
import { mockedTemplates } from '@/store/templates'
import { testComponents } from '@/store/editor'
import { TextComponentProps } from '@/defaultProps'
import { clone, last } from 'lodash-es'

const cloneComponents = clone(testComponents)

describe('test vuex store', () => {
  it('should have three modules', () => {
    expect(store.state).toHaveProperty('user')
    expect(store.state).toHaveProperty('templates')
    expect(store.state).toHaveProperty('editor')
  })

  describe('test user module', () => {
    it('test login mution', () => {
      store.commit('login')
      expect(store.state.user.isLogin).toBeTruthy()
    })
    it('test logout mution', () => {
      store.commit('logout')
      expect(store.state.user.isLogin).toBeFalsy()
    })
  })
  describe('test templates module', () => {
    it('should have default templates', () => {
      expect(store.state.templates.data).toHaveLength(mockedTemplates.length)
    })
    it('should get the correct template by id', () => {
      const temp = store.getters.getTemplateById(1)
      expect(temp.title).toBe('title 1')
    })
  })
  describe('test editor module', () => {
    it('should have default components', () => {
      expect(store.state.editor.components).toHaveLength(cloneComponents.length)
    })
    it('should get current component when set active one component', () => {
      store.commit('setActive', cloneComponents[0].id)
      // console.log('----component id----', cloneComponents[0].id)
      expect(store.state.editor.currentElement).toBe(cloneComponents[0].id)
    })
    it('add component should works fine', () => {
      const payload: Partial<TextComponentProps> = {
        text: 'text1'
      }
      store.commit('addComponent', payload)
      expect(store.state.editor.components).toHaveLength(cloneComponents.length + 1)
      const lastItem = last(store.state.editor.components)
      expect(lastItem?.props.text).toBe('text1')
    })
    it('update component should works fine', () => {
      const props = {
        key: 'text',
        value: 'update text'
      }
      store.commit('updateComponent', props)
      const currentComponent = store.getters.getCurrentElement
      expect(currentComponent.props.text).toBe('update text')
    })

  })
})
