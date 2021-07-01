import { GetServerSideProps } from 'next';
import React from 'react';
import Page from '../../components/templates/Page/Page';
import { APIInternal } from '../../utils/api';

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
  return <Page currentUser={null} title="Login callback" subTitle=""></Page>;
}
