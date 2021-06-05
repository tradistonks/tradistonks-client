import React, { useState, useEffect } from 'react';
import { Area } from '@ant-design/charts';
import styles from './Charts.module.scss';

export default function AreaChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json',
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data: data,
    height: 300,
    width: 500,
    xField: 'Date',
    yField: 'scales',
    color: styles['colorLightBlue'],
  };

  return <Area {...config} />;
}
