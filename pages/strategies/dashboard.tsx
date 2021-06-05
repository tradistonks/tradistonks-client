import { Space, Row, Col } from 'antd';
import React from 'react';
import Page from '../../components/templates/Page/Page';
import Card from '../../components/templates/Card/Card';
import Chart from '../../components/templates/Charts/line-chart';
import PieChart from '../../components/templates/Charts/pie-chart';

export default function Dashboard() {
  return (
    <Page title="Dashboard" subTitle="">
      <Space direction="vertical">
        <Row wrap={true}>
          <Col xs={24} xl={8}>
            <Card title="Results">
              <Chart />
            </Card>
          </Col>
          <Col xs={24} xl={8}></Col>
          <Col xs={24} xl={8}>
            <Card title="">
              <PieChart />
            </Card>
          </Col>
        </Row>
      </Space>
    </Page>
  );
}
