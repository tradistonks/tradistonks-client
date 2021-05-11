import React from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import 'semantic-ui-css/semantic.min.css';
import 'antd/dist/antd.css';
import '../styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
