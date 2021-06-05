import { Layout, PageHeader } from 'antd';
import React, { PropsWithChildren } from 'react';
import styles from './Content.module.scss';

const { Content: AntdContent } = Layout;

export type ContentProps = PropsWithChildren<{
  title: string;
  subTitle?: string;

  extra?: React.ReactNode;

  onBack?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}>;

export default function Content(props: ContentProps) {
  return (
    <AntdContent className={styles['content-wrapper']}>
      <PageHeader
        ghost={false}
        onBack={props.onBack ?? (() => window.history.back())}
        extra={props.extra}
        style={{ backgroundColor: '#1e2633' }}
      >
        <div className={styles['title']}>
          <h1>{props.title}</h1>
          <h2>{props.subTitle}</h2>
          {props.children}
        </div>
      </PageHeader>
    </AntdContent>
  );
}
