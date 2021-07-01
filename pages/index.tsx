import { GetServerSideProps } from 'next';
import React from 'react';
import Page, { PagePropsUser } from '../components/templates/Page/Page';
import { APIInternal } from '../utils/api';
import { MaybeErrorProps } from '../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<HomePageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    const currentUser = await api
      .getCurrentUserWithPermissions()
      .catch(() => null);

    return {
      props: {
        currentUser,
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

export type HomePageProps = PagePropsUser;

export default function HomePage(props: HomePageProps) {
  return (
    <Page
      currentUser={props.currentUser}
      title="Tradistonks"
      subTitle="Home"
    ></Page>
  );
}
