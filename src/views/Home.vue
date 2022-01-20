<template>
  <div class="content-container">
    <a-layout :style="{background: '#fff'}">
      <a-layout-header class="header">
        <div class="page-title">lego项目</div>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <template-list :list="testData"></template-list>
      </a-layout-content>
      <a-layout-footer>
        ©️版权所有 ｜ 津ICP备20210101号
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TemplateList from '../components/TemplateList.vue'

export default defineComponent({
  components: {
    TemplateList
  },
  setup() {
    const testData = [
      {
        id: 1,
        title: 'title',
        author: 'author',
        copiedCount: 100,
        isHot: true,
        isNew: true,
      },
      {
        id: 2,
        title: 'title',
        author: 'author',
        copiedCount: 100,
        isHot: true,
        isNew: true,
      },
      {
        id: 3,
        title: 'title',
        author: 'author',
        copiedCount: 100,
        isHot: true,
        isNew: true,
      },
    ]
    return {
      testData,
    }
  }
})
</script>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  min-height: 85vh;
  max-width: 1200px;
  width: 100%;
}
</style>
