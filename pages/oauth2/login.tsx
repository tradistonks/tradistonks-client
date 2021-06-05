import { Button, Input, notification } from 'antd';
import React from 'react';
import * as api from '../../utils/api';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import Link from 'next/link';
import { ApiError } from '../../utils/api-error';
import { GetServerSideProps } from 'next';
import { MaybeErrorProps } from '../../utils/maybe-error-props';
import Router from 'next/router';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<OAuth2LoginPageProps>
> = async (context) => {
  try {
    const { login_challenge } = context.query;

    if (typeof login_challenge !== 'string') {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }

    return {
      props: {
        login_challenge,
      },
    };
  } catch (error) {
    return {
      props: {
        error: (error instanceof ApiError
          ? error
          : new ApiError(500, 'Unexpected error')
        ).toObject(),
      },
    };
  }
};

type OAuth2LoginPageProps = {
  login_challenge: string;
};

export default function OAuth2LoginPage(props: OAuth2LoginPageProps) {
  type LoginFormData = {
    email: string;
    password: string;
  };

  const onLogin = async ({ email, password }: LoginFormData) => {
    const { data, error } = await api.client.login(
      email,
      password,
      props.login_challenge,
    );

    if (error || !data) {
      notification.error({
        message: 'Failed to login',
        description: error,
      });
    } else {
      Router.push(data.redirect_to);
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
        <Link as="register" href="../register">
          <a>Create a new account</a>
        </Link>
      </Form>
    </Page>
  );
}
