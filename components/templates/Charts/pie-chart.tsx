import React from 'react';
import { Pie } from '@ant-design/charts';
import styles from './Charts.module.scss';

export default function LineChart() {
  const data = [
    {
      country: 'Asia',
      year: '1750',
      value: 502,
    },
    {
      country: 'Asia',
      year: '1800',
      value: 635,
    },
    {
      country: 'Europe',
      year: '1750',
      value: 163,
    },
    {
      country: 'Europe',
      year: '1800',
      value: 203,
    },
  ];

  const config = {
    data,
    height: 300,
    width: 300,
    angleField: 'value',
    colorField: 'country',
    color: [
      styles['colorPurple'],
      styles['colorPink'],
      styles['colorYellow'],
      styles['colorGreen'],
    ],
  };
  return <Pie {...config} />;
}
