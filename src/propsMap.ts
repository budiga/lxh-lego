import { h, VNode } from "vue"
import { TextComponentProps } from "./defaultProps"

export interface IPropToForm {
  component: string;
  subComponent?: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  initialTransform?: (v: any) => any;
  afterTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
}

export type IPropsToForms =  {
 [P in keyof TextComponentProps]?: IPropToForm;
}

const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' },
]
const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: h('span', { style: { fontFamily: font.value }}, font.text),
  }
})

export const mapPropsToForms: IPropsToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: { rows: 3 },
    afterTransform: (e) => e.target.value,
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    initialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e ? `${e}px` : '',
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    initialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    text: '对齐',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ],
    afterTransform: (e) => e.target.value,
  },
  fontFamily: {
    text: '字体',
    component: 'a-select',
    subComponent: 'a-select-option',
    options: [
      { value: '', text: '无' },
      ...fontFamilyOptions,
    ]
  },
  fontWeight: {
    text: '粗细',
    component: 'icon-switch',
    initialTransform: (v: string) => v === 'bold',
    // afterTransform: (e: boolean) => e ? 'bold' : 'normal',
    valueProp: 'checked',
    extraProps: { iconName: 'BoldOutlined', tip: '加粗' }
  },
}
