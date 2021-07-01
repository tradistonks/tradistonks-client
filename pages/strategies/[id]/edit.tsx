import {
  Button,
  Col,
  Collapse,
  Divider,
  notification,
  Row,
  Table,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { StrategyForm } from '../../../components/organisms/StrategyForm/StrategyForm';
import Page, { PagePropsUser } from '../../../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../../../utils/api';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import {
  RunResultDTOHistoryCandle,
  RunResultDTOOrder,
  RunResultDTOPhase,
} from '../../../utils/dto/run-result.dto';
import { StrategyDTO } from '../../../utils/dto/strategy.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';
import styles from './edit.module.scss';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<EditStrategyPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    const currentUser = await api
      .getCurrentUserWithPermissions()
      .catch(() => null);

    if (!currentUser) {
      return api.createErrorServerSideProps(401, 'Unauthorize');
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const strategyId = context.params!.id as string;
    const strategy = await api.getStrategy(strategyId);

    if (!strategy) {
      return api.createErrorServerSideProps(
        404,
        "This strategy doesn't exists",
      );
    }

    return {
      props: {
        currentUser,
        languages: await api.getLanguages(),
        strategy,
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type EditStrategyPageProps = PagePropsUser & {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
  strategy: StrategyDTO;
};

export default function EditStrategyPage(props: EditStrategyPageProps) {
  const api = new APIExternal();

  const [form] = useForm<StrategyDTO>();

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isRunLoading, setIsRunLoading] = useState(false);

  const [phasesResult, setPhasesResult] = useState<RunResultDTOPhase[]>([]);
  const [ordersResult, setOrdersResult] = useState<RunResultDTOOrder[]>([]);
  const [historyResult, setHistoryResult] = useState<
    Record<number, Record<string, RunResultDTOHistoryCandle>> | undefined
  >(undefined);
  const [pnl, setPnl] = useState<
    Record<number, Record<string, number>> | undefined
  >(undefined);

  const onEdit = async (strategy: StrategyDTO): Promise<boolean> => {
    setIsUpdateLoading(true);

    try {
      await api.updateStrategy(props.strategy._id, strategy);

      notification.success({
        message: 'Successfully updated the strategy',
      });

      return true;
    } catch (error) {
      notification.error({
        message: 'Failed to update the strategy',
        description: api.errorToString(error),
      });

      return false;
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const onRun = async () => {
    setIsRunLoading(true);

    try {
      const strategyData = await form.validateFields();

      if (await onEdit(strategyData)) {
        const data = await api.runStrategy(props.strategy._id);

        const hasPhaseError = data.phases.some((phase) => phase.status != 0);

        if (hasPhaseError) {
          notification.warning({
            message: 'An error occured while running the strategy',
          });
        } else {
          notification.success({
            message: 'Successfully runned the strategy',
          });
        }

        setPhasesResult(data.phases);
        setOrdersResult(data.orders ?? []);
        setHistoryResult(data.history ?? undefined);
        setPnl(data.pnl ?? undefined);
      }
    } catch (error) {
      notification.error({
        message: 'Failed to run the strategy',
        description: api.errorToString(error),
      });
    }

    setIsRunLoading(false);
  };

  return (
    <Page
      currentUser={props.currentUser}
      title="Strategies"
      subTitle="Edit a strategy"
    >
      <StrategyForm
        form={form}
        initialValues={props.strategy}
        onFinish={onEdit}
        languages={props.languages}
        actions={[
          <Button
            key="action-run"
            type="default"
            disabled={!isRunLoading && isUpdateLoading}
            loading={isRunLoading && !isUpdateLoading}
            onClick={onRun}
          >
            Update and Run
          </Button>,
          <Button
            key="action-update"
            type="primary"
            disabled={!isUpdateLoading && isRunLoading}
            loading={isUpdateLoading && !isRunLoading}
            htmlType="submit"
          >
            Update
          </Button>,
        ]}
      />

      {phasesResult.length === 0 ? null : (
        <Row justify="end">
          <Col span={18}>
            <Typography.Title level={4}>Phases</Typography.Title>
            <Collapse>
              {phasesResult.map((phaseResult, i) => (
                <Collapse.Panel
                  header={phaseResult.name}
                  key={i}
                  style={{
                    backgroundColor:
                      phaseResult.status != 0 ? '#ff3c43' : undefined,
                  }}
                  extra={<span>{phaseResult.time_wall}s</span>}
                >
                  {!phaseResult.stdout ? null : (
                    <>
                      <Typography.Title level={3}>stdout</Typography.Title>
                      <p className={styles['phase-result']}>
                        {phaseResult.stdout}
                      </p>

                      <Divider />
                    </>
                  )}

                  {!phaseResult.stderr ? null : (
                    <>
                      <Typography.Title level={3}>stderr</Typography.Title>
                      <p className={styles['phase-result']}>
                        {phaseResult.stderr}
                      </p>
                    </>
                  )}

                  {phaseResult.stdout || phaseResult.stderr ? null : (
                    <div>
                      <code>stdout</code> and <code>stderr</code> are empty.
                    </div>
                  )}
                </Collapse.Panel>
              ))}
            </Collapse>
          </Col>
        </Row>
      )}

      {ordersResult.length === 0 ? null : (
        <Row justify="end">
          <Col span={18}>
            <Divider />
            <Typography.Title level={4}>Orders</Typography.Title>
            <Table
              dataSource={ordersResult}
              columns={[
                {
                  title: 'Date',
                  dataIndex: 'timestamp',
                  key: 'date',
                  render: (timestamp: number) =>
                    moment(timestamp * 1000).format('LLL'),
                },
                {
                  title: 'Type',
                  dataIndex: 'type',
                  key: 'type',
                },
                {
                  title: 'Symbol',
                  dataIndex: 'symbol',
                  key: 'symbol',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
              ]}
            />
          </Col>
        </Row>
      )}

      {historyResult === undefined || pnl === undefined ? null : (
        <Row justify="end">
          <Col span={18}>
            {(() => {
              console.log(pnl);
              const timestamps = Object.keys(pnl);

              const labels = [];
              const data: Record<string, number[]> = {};

              for (let i = 0; i < timestamps.length; i += 100) {
                const timestamp = Number(timestamps[i]);

                labels.push(moment(timestamp * 1000).format('LLL'));

                for (const symbol in pnl[timestamp]) {
                  if (!data[symbol]) {
                    data[symbol] = [];
                  }

                  data[symbol].push(pnl[timestamp][symbol] ?? 0);
                }
              }

              return (
                <Line
                  type="line"
                  data={{
                    labels,
                    datasets: Object.entries(data).map(([symbol, values]) => ({
                      label: symbol,
                      data: values,
                      fill: false,
                      tension: 0.4,
                      backgroundColor: 'rgb(255, 99, 132, 0.5)',
                      borderColor: 'rgba(255, 99, 132)',
                    })),
                  }}
                  options={{
                    responsive: true,
                  }}
                />
              );
            })()}
          </Col>
        </Row>
      )}
    </Page>
  );
}
