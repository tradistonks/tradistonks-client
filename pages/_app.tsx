import React from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import Error from 'next/error';

import 'antd/dist/antd.css';
import '../styles/globals.scss';
import { hasErrorProps } from '../utils/maybe-error-props';
import Page from '../components/templates/Page/Page';
import { UserWithPermissionsDTO } from '../utils/dto/user.dto';

export default function App({ Component, pageProps }: AppProps) {
  if (hasErrorProps(pageProps)) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Page
        currentUser={pageProps.user as UserWithPermissionsDTO}
        title="Error"
        subTitle=""
      >
        <Error
          statusCode={pageProps.error.status}
          title={pageProps.error.message}
        />
      </Page>
    );
  }

  return <Component {...pageProps} />;
}
