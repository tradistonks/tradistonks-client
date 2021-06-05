import { Layout, Menu } from 'antd';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';

const { SubMenu } = Menu;

const { Sider: AntdSider } = Layout;

export default function SiderMenu() {
  return (
    <AntdSider
      className={styles['header-wrapper']}
      style={{ backgroundColor: '$color-font' }}
    >
      <Menu
        defaultOpenKeys={['nav-languages', 'subStrategies', 'subUsers']}
        theme="dark"
        className={styles['ant-menu']}
        mode="inline"
      >
        <Menu.Item key="nav-languages">
          <Link href="/languages" replace={true}>
            <span>Languages</span>
          </Link>
        </Menu.Item>
        <SubMenu key="subStrategies" title="Strategies">
          <Menu.Item key="dashboard">
            <Link
              as="/strategies/dashboard"
              href="/strategies/dashboard"
              replace={true}
            >
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="newStrategy">
            <Link as="/strategies/new" href="/strategies/create" replace={true}>
              <span>New</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="Mystrategies">
            <Link
              as="/strategies/Mystrategies"
              href="/strategies/strategies"
              replace={true}
            >
              <span>My strategies</span>
            </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="subUsers" title="My Account">
          <Menu.Item key="information">
            <Link
              as="/users/informations"
              href="/users/informations"
              replace={true}
            >
              <span>My Information</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="Logout">
            <Link as="logout" href="/users/logout" replace={true}>
              <span>Logout</span>
            </Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </AntdSider>
  );
}
