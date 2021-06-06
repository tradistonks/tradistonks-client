import { Layout, Menu } from 'antd';
import Link from 'next/link';
import React from 'react';

const { Header: AntdHeader } = Layout;

export default function Header() {
  return (
    <AntdHeader>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="nav-home">
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="nav-languages">
          <Link href="/languages">
            <a>Languages</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="nav-strategies">
          <Link href="/users/me/strategies">
            <a>My strategies</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="login">
          <Link href="/login">
            <a>Login</a>
          </Link>
        </Menu.Item>
      </Menu>
    </AntdHeader>
  );
}
