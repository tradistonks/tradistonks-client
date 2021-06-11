import { Button, Input, notification } from 'antd';
import Router from 'next/router';
import React from 'react';
import Form from '../components/atoms/Form/Form';
import FormItem from '../components/atoms/FormItem/FormItem';
import Page from '../components/templates/Page/Page';
import { APIExternal } from '../utils/api';

export default function Register() {
  const api = new APIExternal();

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
    try {
      await api.register(email, username, password, passwordConfirmation);

      Router.push('/login');
    } catch (error) {
      notification.error({
        message: 'Failed to register',
        description: api.errorToString(error),
      });
    }
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
