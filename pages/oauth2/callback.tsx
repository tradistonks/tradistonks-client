import { GetServerSideProps } from 'next';
import React from 'react';
import Page from '../../components/templates/Page/Page';
import { ServerSideAPI } from '../../utils/api.server';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code, state } = context.query;

  if (typeof code !== 'string' || typeof state !== 'string') {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }

  const api = new ServerSideAPI(context);

  try {
    await api.authLocalCallback(code, state);

    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
};

export default function OAuth2CallbackPage() {
  return <Page title="Login callback" subTitle=""></Page>;
}
