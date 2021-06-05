import { Card as AntdCard, Space } from 'antd';
import React, { PropsWithChildren } from 'react';
import styles from './Card.module.scss';

export type CardProps = PropsWithChildren<{
  title: string;
}>;

export default function Card(props: CardProps) {
  return (
    <Space direction="vertical">
      <AntdCard className={styles['card']}>
        <div className={styles['title']}>
          <h2>{props.title}</h2>
        </div>
        {props.children}
      </AntdCard>
    </Space>
  );
}
