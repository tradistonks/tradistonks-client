import { Layout } from 'antd';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import Content from '../../organisms/Content/Content';
import Header from '../../organisms/Header/Header';
import styles from './Page.module.scss';

import MenuSider from '../../organisms/Header/Menu';

export type PageProps = PropsWithChildren<{
  title: string;
  subTitle: string;
}>;

export default function Page(props: PageProps) {
  return (
    <Layout className={styles['layout']}>
      <Header />
      <Layout>
        <MenuSider/>
        <Head>
          <title>{props.title}</title>
        </Head>
        <Content title={props.title} subTitle={props.subTitle}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
}
