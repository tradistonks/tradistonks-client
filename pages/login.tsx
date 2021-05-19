import { Button } from 'antd';
import React from 'react';
import Page from '../components/templates/Page/Page';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: {
    OAUTH2_LOCAL_URL,
    OAUTH2_LOCAL_CLIENT_ID,
    OAUTH2_LOCAL_REDIRECT_URL,
    OAUTH2_PKCE_STATE,
  },
} = getConfig();

export default function LoginPage() {
  return (
    <Page title="Login" subTitle="">
      <Button
        href={`${OAUTH2_LOCAL_URL}?client_id=${OAUTH2_LOCAL_CLIENT_ID}&redirect_uri=${OAUTH2_LOCAL_REDIRECT_URL}&response_type=code&state=${OAUTH2_PKCE_STATE}&scope=identify+offline`}
      >
        Login using email and password
      </Button>
    </Page>
  );
}
