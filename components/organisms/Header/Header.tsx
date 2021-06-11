import { Layout, Menu } from 'antd';
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
