import React from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import Error from 'next/error';

import 'semantic-ui-css/semantic.min.css';
import 'antd/dist/antd.css';
import '../styles/globals.scss';
import { hasErrorProps } from '../utils/maybe-error-props';

export default function App({ Component, pageProps }: AppProps) {
  if (hasErrorProps(pageProps)) {
    return (
      <Error
        statusCode={pageProps.error.status}
        title={pageProps.error.message}
      />
    );
  }

  return <Component {...pageProps} />;
}
