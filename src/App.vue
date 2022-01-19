<template>
  <h1>lego标准模版</h1>
  <hello msg="你好世界"/>
  <ul>
    <li>支持ts、vue3、eslint</li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Hello from './components/Hello'

var b = 100
let a = 1
export default defineComponent({
  name: 'App',
  components: {
    Hello,
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
  margin-top: 60px;
}
</style>
