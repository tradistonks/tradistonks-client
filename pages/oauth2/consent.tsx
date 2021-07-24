import { Button, notification } from 'antd';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Router from 'next/router';
import React from 'react';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../../utils/api';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

const {
  publicRuntimeConfig: { OAUTH2_LOCAL_CLIENT_ID },
} = getConfig();

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<OAuth2ConsentPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    const currentUser = await api
      .getCurrentUserWithPermissions()
      .catch(() => null);

    if (currentUser) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    const { consent_challenge } = context.query;

    if (typeof consent_challenge !== 'string') {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }

    const consentInfo = await api.getConsent(consent_challenge);

    if (!consentInfo) {
      return {
        redirect: {
          permanent: false,
          destination: '/login',
        },
      };
    }

    if (consentInfo.client_id === OAUTH2_LOCAL_CLIENT_ID) {
      try {
        const data = await api.consent(consent_challenge);

        return {
          redirect: {
            permanent: false,
            destination: data.redirect_to,
          },
        };
      } catch {}
    }

    return {
      props: {
        consent_challenge,
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type OAuth2ConsentPageProps = {
  consent_challenge: string;
};

export default function OAuth2ConsentPage(props: OAuth2ConsentPageProps) {
  const api = new APIExternal();

  const onConsent = async () => {
    try {
      const data = await api.consent(props.consent_challenge);

      Router.replace(data.redirect_to);
    } catch (error) {
      notification.error({
        message: 'Failed to consent',
        description: api.errorToString(error),
      });
    }
  };

  return (
    <Page currentUser={null} title="Consent" subTitle="Connect to your account">
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
