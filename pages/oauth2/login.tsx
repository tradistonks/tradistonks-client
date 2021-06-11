import { Button, Input, notification } from 'antd';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../../utils/api';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<OAuth2LoginPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  const { login_challenge } = context.query;

  if (typeof login_challenge !== 'string') {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  try {
    const currentUser = await api.getCurrentUser().catch(() => null);

    if (currentUser) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    return {
      props: {
        login_challenge,
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type OAuth2LoginPageProps = {
  login_challenge: string;
};

export default function OAuth2LoginPage(props: OAuth2LoginPageProps) {
  const api = new APIExternal();

  type LoginFormData = {
    email: string;
    password: string;
  };

  const onLogin = async ({ email, password }: LoginFormData) => {
    try {
      const data = await api.login(email, password, props.login_challenge);

      Router.push(data.redirect_to);
    } catch (error) {
      notification.error({
        message: 'Failed to login',
        description: api.errorToString(error),
      });
    }
  };

  return (
    <Page currentUser={null} title="Login" subTitle="Connect to your account">
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
