<template>
  <div class="props-table">
    <div
      v-for="(item, key) in finalProps"
      :key="key"
      class="prop-item"
    >
      <span v-if="item.text" class="label">{{item.text}}</span>
      <div class="prop-component">
        <component
          v-if="item"
          :is="item.component"
          :[item.valueProp]="item.value"
          v-bind="item.extraProps"
          v-on="item.events"
        >
          <template v-if="item.options">
            <component
              :is="item.subComponent"
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
            >
              <render-vnode :vNode="option.text" />
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed, VNode,
} from 'vue'
import { reduce } from 'lodash-es'
import { TextComponentProps } from '../defaultProps'
import { mapPropsToForms } from '../propsMap'
import RenderVnode from '../components/RenderVnode'

interface IFormProps {
  component: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  initialTransform?: (v: any) => any;
  valueProp: string;
  eventName: string;
  events: {[key: string]: (e: any) => void};
}

export default defineComponent({
  name: 'props-table',
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  components: {
    RenderVnode,
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(props.props, (result, value, key) => {
        const newKey = key as keyof TextComponentProps
        const item = mapPropsToForms[newKey]
        if (item) {
          const {
            valueProp = 'value',
            eventName = 'change',
            initialTransform,
            afterTransform
          } = item
          const newItem: IFormProps = {
            ...item,
            valueProp,
            eventName,
            value: initialTransform ? initialTransform(value): value,
            events: {
              [eventName]: (e: any) => {
                context.emit('change', { key, value: afterTransform ? afterTransform(e) : e })
              },
            },
          }
          result[newKey] = newItem
        }
        return result
      }, {} as { [key: string]: IFormProps })
    })

    return {
      finalProps,
    }
  },
})
</script>
<style scoped>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  text-align: left;
}
.label {
  width: 28%;
}
.prop-component {
  width: 72%;
}
</style>
