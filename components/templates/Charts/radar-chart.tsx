import React, { useState, useEffect } from 'react';
import { Radar } from '@ant-design/charts';
import styles from './Charts.module.scss';
import DataSet from '@antv/data-set';

export default function RadarChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/bda695a8-cd9f-4b78-a423-3d6d547c10c3.json',
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const { DataView } = DataSet;
  const dv = new DataView().source(data);
  dv.transform({
    type: 'fold',
    fields: ['a', 'b'],
    key: 'user',
    value: 'score',
  });
  const config = {
    data: dv.rows,
    height: 300,
    width: 300,
    xField: 'item',
    yField: 'score',
    seriesField: 'user',
    color: [styles['colorYellow'], styles['colorGreen']],
    meta: {
      score: {
        alias: '',
        min: 0,
        max: 80,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    yAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
      },
    },
    point: {},
  };

  return <Radar {...config} />;
}
