import { Form as AntdForm, FormProps as AntdFormProps } from 'antd';
import React from 'react';

export type FormProps = AntdFormProps;

export default function Form(props: FormProps) {
  return <AntdForm layout="vertical" {...props} />;
}
