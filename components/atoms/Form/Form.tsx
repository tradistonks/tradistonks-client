import { Form as AntdForm, FormProps as AntdFormProps } from 'antd';
import { FormListProps as AntdFormListProps } from 'antd/lib/form';
import React from 'react';

export type FormProps = AntdFormProps;

export default function Form(props: FormProps) {
  return <AntdForm layout="vertical" {...props} />;
}

export type FormListProps = AntdFormProps;

export function FormList(props: AntdFormListProps) {
  return <AntdForm.List {...props}></AntdForm.List>;
}
