import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  component: string;
  value?: string;
}

export type IPropsToForms =  {
 [P in keyof TextComponentProps]?: PropToForm;
}

export const mapPropsToForms: IPropsToForms = {
  text: {
    component: 'a-input',
  },
}
