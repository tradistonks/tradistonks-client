import { Layout, Menu } from 'antd';
import React from 'react';

const { Header: AntdHeader } = Layout;

export default function Header() {
  return (
    <AntdHeader>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="nav-home">Home</Menu.Item>
        <Menu.Item key="nav-languages">Languages</Menu.Item>
        <Menu.Item key="nav-strategies">Strategies</Menu.Item>
      </Menu>
    </AntdHeader>
  );
}
