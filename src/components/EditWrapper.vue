
<template>
  <div class="edit-wrapper" @click="onItemClick(id)" :class="{active: active}">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    id: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['set-active'],
  setup(props, context) {
    const onItemClick = (id: string) => {
      context.emit('set-active', id)
    }

    return {
      onItemClick,
    }
  },
})
</script>

<style scoped>
.edit-wrapper {
  padding: 0;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
}
.edit-wrapper:hover {
  border: 1px solid #ccc;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
</style>
