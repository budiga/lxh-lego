<template>
  <div class="app-container">
    <a-spin v-if="showLoading" tip="读取中" class="global-spinner"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import Uploder from '@/components/Uploader.vue'

export default defineComponent({
  name: 'App',
  setup() {
    const showLoading = ref(true)
    setTimeout(() => {
      showLoading.value = false
    }, 1000)

    return {
      showLoading,
    }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
