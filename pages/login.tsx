import { Button } from 'antd';
import React from 'react';
import Page, { PagePropsUser } from '../components/templates/Page/Page';
import getConfig from 'next/config';
import { MaybeErrorProps } from '../utils/maybe-error-props';
import { GetServerSideProps } from 'next';
import { APIInternal } from '../utils/api';

const {
  publicRuntimeConfig: {
    OAUTH2_LOCAL_URL,
    OAUTH2_LOCAL_CLIENT_ID,
    OAUTH2_LOCAL_REDIRECT_URL,
    OAUTH2_PKCE_STATE,
  },
} = getConfig();

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<LoginPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    const currentUser = await api
      .getCurrentUserWithPermissions()
      .catch(() => null);

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

export type LoginPageProps = PagePropsUser;

export default function LoginPage(props: LoginPageProps) {
  return (
    <Page currentUser={props.currentUser} title="Login" subTitle="">
      <Button
        href={`${OAUTH2_LOCAL_URL}?client_id=${OAUTH2_LOCAL_CLIENT_ID}&redirect_uri=${OAUTH2_LOCAL_REDIRECT_URL}&response_type=code&state=${OAUTH2_PKCE_STATE}&scope=identify+offline`}
      >
        Login using email and password
      </Button>
    </Page>
  );
}
