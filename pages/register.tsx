import { Button, Input, notification } from 'antd';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React from 'react';
import Form from '../components/atoms/Form/Form';
import FormItem from '../components/atoms/FormItem/FormItem';
import Page, { PagePropsUser } from '../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../utils/api';
import { MaybeErrorProps } from '../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<RegisterPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    const currentUser = await api.getCurrentUser().catch(() => null);

    if (currentUser) {
      return api.createErrorServerSideProps(401, 'Unauthorize');
    }

    return {
      props: {
        currentUser,
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

export type RegisterPageProps = PagePropsUser;

export default function RegisterPage(props: RegisterPageProps) {
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
    <Page
      currentUser={props.currentUser}
      title="Register"
      subTitle="Create a new account"
    >
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
