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

            {!props.currentUser ||
            !props.currentUser.permissions.some((permission) =>
              [
                'manage-languages',
                'manage-users',
                'manage-roles',
                'manage-permissions',
              ].includes(permission),
            ) ? null : (
              <SubMenu
                key="nav-admin"
                icon={<SettingOutlined />}
                title="Administration"
              >
                {!props.currentUser.permissions.includes(
                  'manage-languages',
                ) ? null : (
                  <Menu.ItemGroup title="Languages">
                    <Menu.Item key="nav-admin-strategies-languages">
                      <Link href="/admin/languages">
                        <a>Languages</a>
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                )}
                <Menu.ItemGroup title="Users">
                  {!props.currentUser.permissions.includes(
                    'manage-users',
                  ) ? null : (
                    <Menu.Item key="nav-admin-users-users">
                      <Link href="/admin/users">
                        <a>Users</a>
                      </Link>
                    </Menu.Item>
                  )}
                  {!props.currentUser.permissions.includes(
                    'manage-roles',
                  ) ? null : (
                    <Menu.Item key="nav-admin-users-roles">
                      <Link href="/admin/roles">
                        <a>Roles</a>
                      </Link>
                    </Menu.Item>
                  )}
                  {!props.currentUser.permissions.includes(
                    'manage-permissions',
                  ) ? null : (
                    <Menu.Item key="nav-admin-users-permissions">
                      <Link href="/admin/permissions">
                        <a>Permissions</a>
                      </Link>
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              </SubMenu>
            )}
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
