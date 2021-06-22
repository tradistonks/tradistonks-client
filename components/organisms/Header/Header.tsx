import { SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import Link from 'next/link';
import React from 'react';
import { PagePropsUser } from '../../templates/Page/Page';

const { Header: AntdHeader } = Layout;

export type HeaderProps = PagePropsUser;

export default function Header(props: HeaderProps) {
  return (
    <AntdHeader>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="nav-home">
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        {!props.currentUser ? null : (
          <>
            <Menu.Item key="nav-strategies">
              <Link href="/users/me/strategies">
                <a>My strategies</a>
              </Link>
            </Menu.Item>

            <SubMenu
              key="nav-admin"
              icon={<SettingOutlined />}
              title="Administration"
            >
              <Menu.ItemGroup title="Strategies">
                <Menu.Item key="nav-admin-strategies-languages">
                  <Link href="/languages">
                    <a>Languages</a>
                  </Link>
                </Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Users">
                <Menu.Item key="nav-admin-users-users">
                  <Link href="/users">
                    <a>Users</a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="nav-admin-users-roles">
                  <Link href="/roles">
                    <a>Roles</a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="nav-admin-users-permissions">
                  <Link href="/permissions">
                    <a>Permissions</a>
                  </Link>
                </Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
          </>
        )}
        {props.currentUser ? (
          <Menu.Item key="logout" style={{ float: 'right' }} danger>
            <Link href="/logout">
              <a>Logout</a>
            </Link>
          </Menu.Item>
        ) : (
          <Menu.Item key="login" style={{ float: 'right' }}>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Menu.Item>
        )}
      </Menu>
    </AntdHeader>
  );
}
