import { Button, Input, notification } from 'antd';
import React from 'react';
import * as api from '../utils/api';
import Form from '../components/atoms/Form/Form';
import FormItem from '../components/atoms/FormItem/FormItem';
import Page from '../components/templates/Page/Page';
import Link from 'next/link';

export default function Login() {
  type LoginFormData = {
    email: string;
    password: string;
  };

  const onLogin = async ({ email, password }: LoginFormData) => {
    const { data, error } = await api.client.login(email, password);

    if (error) {
      notification.error({
        message: 'Failed to login',
        description: error,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { access_token } = data!;

      console.log(access_token);
    }
  };

  return (
    <Page title="Login" subTitle="Connect to your account">
      <Form onFinish={onLogin}>
        <FormItem name="email" label="Email" rules={[{ required: true }]}>
          <Input />
          </FormItem>
        <FormItem name="password" label="Password" rules={[{ required: true }]}>
          <Input type="password" />
          </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          </FormItem>
          <Link href="/register">
            <a>Create a new account</a>
          </Link>
      </Form>
    </Page>
  );
}
