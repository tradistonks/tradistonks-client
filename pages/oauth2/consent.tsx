import { Button, notification } from 'antd';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React from 'react';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import * as api from '../../utils/api';
import { ApiError } from '../../utils/api-error';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<OAuth2ConsentPageProps>
> = async (context) => {
  try {
    const { consent_challenge } = context.query;

    if (typeof consent_challenge !== 'string') {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }

    return {
      props: {
        consent_challenge,
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

type OAuth2ConsentPageProps = {
  consent_challenge: string;
};

export default function OAuth2ConsentPage(props: OAuth2ConsentPageProps) {
  type ConsentFormData = {
    email: string;
    password: string;
  };

  const onConsent = async ({ email, password }: ConsentFormData) => {
    const { data, error } = await api.client.consent(
      email,
      password,
      props.consent_challenge,
    );

    if (error || !data) {
      notification.error({
        message: 'Failed to consent',
        description: error,
      });
    } else {
      Router.replace(data.redirect_to);
    }
  };

  return (
    <Page title="Consent" subTitle="Connect to your account">
      <Form onFinish={onConsent}>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Consent
          </Button>
        </FormItem>
      </Form>
    </Page>
  );
}
