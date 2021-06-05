import React, { PropsWithChildren } from 'react';
import { Liquid } from '@ant-design/charts';
import styles from './Charts.module.scss';

export type GaugeProps = PropsWithChildren<{
  percent: number;
}>;

export default function GaugeChart(props: GaugeProps) {
  const config = {
    percent: props.percent,
    outline: {
      border: 4,
      distance: 8,
    },
    wave: { length: 128 },
    color: [styles['colortBlue']],
  };
  return <Liquid {...config} />;
}
