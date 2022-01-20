<template>
  <div class="editor-page">
    <a-layout :style="{background: '#fff'}">
      <a-layout-header class="header">
        <div class="page-title">lego项目</div>
      </a-layout-header>
    </a-layout>

    <a-layout class="editor-content">
      <a-layout-sider width="300" style="background: yellow">
        组件列表
      </a-layout-sider>
      <a-layout>
        画布区域
      </a-layout>
      <a-layout-sider width="300" style="background: yellow">
        组件样式
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {

    return {

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
