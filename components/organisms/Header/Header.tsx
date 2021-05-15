import { Layout, Menu , } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import React from 'react';

const { Header: AntdHeader } = Layout;

export default function Header() {
  return (
    <AntdHeader>
      <Router>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="nav-home"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="nav-languages"><Link to="/languages">Languages</Link></Menu.Item>
        <Menu.Item key="nav-strategies"><Link to="/strategies">Strategies</Link></Menu.Item>
        <Menu.Item key="nav-login"><Link to="/login">Login</Link></Menu.Item>
      </Menu>
      </Router>
    </AntdHeader>
  );
}
