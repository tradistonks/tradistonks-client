import { Space, Row, Col } from 'antd';
import React from 'react';
import Page from '../../components/templates/Page/Page';
import Card from '../../components/templates/Card/Card';
import AreaChart from '../../components/templates/Charts/area-chart';
import RadarChart from '../../components/templates/Charts/radar-chart';

export default function StrategiesBoard() {
return (
    <Page title="Strategies" subTitle="">
      <Space direction="vertical">
        <Row wrap={false}>
          <Col xs={24} xl={8}>
            <Card title="Profits">
              <AreaChart />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
          </Col>
          <Col xs={24} xl={8}></Col>
          <Card title="My sells">
              <RadarChart />
            </Card>
        </Row>
      </Space>
    </Page>
  );
}