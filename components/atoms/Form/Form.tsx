import { Form as AntdForm, FormProps as AntdFormProps } from 'antd';
import React from 'react';

export type FormProps = AntdFormProps;

export default function Form(props: FormProps) {
  const { labelCol = {}, wrapperCol = {}, ...others } = props;

  return (
    <AntdForm
      {...others}
      labelCol={{ span: 4, ...labelCol }}
      wrapperCol={{ span: 20, ...wrapperCol }}
    />
  );
}
