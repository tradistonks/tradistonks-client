import { Button, Form, Input, notification } from 'antd';
import React from 'react';
import * as api from '../utils/api';

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
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onLogin}>
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
