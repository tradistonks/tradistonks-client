import { Button, Form, Input, notification } from 'antd';
import React from 'react';
import * as api from '../utils/api';

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
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={onRegister}
    >
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="passwordConfirmation"
        label="Confirmed Password"
        rules={[{ required: true }]}
      >
        <Input type="password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
