<template>
  <a-button
    type="primary"
    v-if="!user.isLogin"
    class="user-profile-component"
    @click="login"
  >
    登录
  </a-button>
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{user.username}}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="logout">
            登出
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'


export default defineComponent({
  props: {
    user: {
      type: Object as PropType<{ username?: string; isLogin: boolean; }>,
      required: true,
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const login = () => {
      store.commit('login')
      message.success('登录成功', 2)
    }
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功，2s后跳转到首页', 2)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }

    return {
      login,
      logout,
    }
  },
})
</script>
