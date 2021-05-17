import { Button, Input, notification } from 'antd';
import React from 'react';
import * as api from '../utils/api';
import Form from '../components/atoms/Form/Form';
import FormItem from '../components/atoms/FormItem/FormItem';
import Page from '../components/templates/Page/Page';

export default function Register() {
  type LoginFormData = {
    email: string;
    username: string;
    password: string;
    passwordConfirmation: string;
  };

  const onRegister = async ({
    email,
    username,
    password,
    passwordConfirmation,
  }: LoginFormData) => {
    const { data, error } = await api.client.register(
      email,
      username,
      password,
      passwordConfirmation,
    );

    if (error) {
      notification.error({
        message: 'Failed to register',
        description: error,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    console.log(data!);
  };
  return (
    <Page title="Register" subTitle="Create a new account">
      <Form onFinish={onRegister}>
        <FormItem name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </FormItem>
        <FormItem name="username" label="Username" rules={[{ required: true }]}>
          <Input />
        </FormItem>
        <FormItem name="password" label="Password" rules={[{ required: true }]}>
          <Input type="password" />
        </FormItem>
        <FormItem
          name="passwordConfirmation"
          label="Confirmed Password"
          rules={[{ required: true }]}
        >
          <Input type="password" />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </FormItem>
      </Form>
    </Page>
  );
}
