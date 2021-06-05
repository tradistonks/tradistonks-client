import React from 'react';
import { Line } from '@ant-design/charts';
import styles from './Charts.module.scss';

export default function LineChart() {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config = {
    data,
    height: 300,
    width: 300,
    xField: 'year',
    yField: 'value',
    colorField: 'value',
    color: styles['colorYellow'],
    point: {
      size: 3,
      shape: 'diamond',
      color: [styles['colorPurple']],
    },
  };
  return <Line {...config} />;
}
