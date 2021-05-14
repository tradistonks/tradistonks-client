import { Layout } from 'antd';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import Content from '../../organisms/Content/Content';
import Header from '../../organisms/Header/Header';
import styles from './Page.module.scss';

export type PageProps = PropsWithChildren<{
  title: string;
  subTitle: string;
}>;

export default function Page(props: PageProps) {
  return (
    <Layout className={styles['layout']}>
      <Head>
        <title>{props.title}</title>
      </Head>

      <Header />

      <Content title={props.title} subTitle={props.subTitle}>
        {props.children}
      </Content>
    </Layout>
  );
}
