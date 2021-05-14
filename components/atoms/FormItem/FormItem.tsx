import { Form as AntdForm, FormItemProps as AntdFormItemsProps } from 'antd';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormItemProps<Values = any> = AntdFormItemsProps<Values>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FormItem<Values = any>(props: FormItemProps<Values>) {
  return <AntdForm.Item {...props} />;
}
