import { Layout } from 'antd';
import Head from 'next/head';
import React, { PropsWithChildren } from 'react';
import Content from '../../organisms/Content/Content';
import Header from '../../organisms/Header/Header';
import styles from './Page.module.scss';

export type PageProps = PropsWithChildren<{
  title: string;
  subTitle: string;

  extra?: React.ReactNode;

  onBack?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}>;

export default function Page(props: PageProps) {
  return (
    <Layout className={styles['layout']}>
      <Head>
        <title>
          {props.subTitle ? `${props.subTitle} - ` : ''}
          {props.title}
        </title>
      </Head>

      <Header />

      <Content
        title={props.title}
        subTitle={props.subTitle}
        extra={props.extra}
        onBack={props.onBack}
      >
        {props.children}
      </Content>
    </Layout>
  );
}
