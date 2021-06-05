import { Layout, Menu } from 'antd';

const { Header } = Layout;
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';
import '../../../styles/antd-variables.less';

export default function HeaderMenu() {
  return (
    <Header className={styles['header-wrapper']}>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="nav-home">
          <Link href="/" replace={true}>
            <span>Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="Login">
          <Link as="login" href="login" replace={true}>
            <span>Login</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
}
