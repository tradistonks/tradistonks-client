import { Space } from 'antd';
import React from 'react';
import Page from '../../components/templates/Page/Page';
import Card from '../../components/templates/Card/Card';

export default function AccountInformation() {
  return (
    <Page title="Account Information" subTitle="">
      <Space direction="vertical">
        <Card title="My Information">
          <p>Email Address</p>
          <p>Username</p>
        </Card>
      </Space>
    </Page>
  );
}
