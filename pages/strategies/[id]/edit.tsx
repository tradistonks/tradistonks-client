import {
  Button,
  Col,
  Collapse,
  Divider,
  Input,
  notification,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { FormEditor } from '../../../components/atoms/Editor/Editor';
import Form from '../../../components/atoms/Form/Form';
import FormItem from '../../../components/atoms/FormItem/FormItem';
import Page from '../../../components/templates/Page/Page';
import { StrategyDTO } from '../../../types/dto/strategy.dto';
import * as api from '../../../utils/api';
import { ApiError } from '../../../utils/api-error';
import { ServerSideAPI } from '../../../utils/api.server';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import { RunResultDTOPhase } from '../../../utils/dto/run-result.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<EditStrategyPageProps>
> = async (context) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const strategyId = context.params!.id as string;
    const server_api = new ServerSideAPI(context);

    const strategy = await server_api.getStrategy(strategyId);

    if (!strategy) {
      return {
        props: {
          error: new ApiError(404, "This strategy doesn't exists"),
        },
      };
    }

    return {
      props: {
        languages: await server_api.getLanguages(),
        strategy,
      },
    };
  } catch (error) {
    return {
      props: {
        error: (error instanceof ApiError
          ? error
          : new ApiError(500, 'Unexpected error')
        ).toObject(),
      },
    };
  }
};

type EditStrategyPageProps = {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
  strategy: StrategyDTO;
};

export default function EditStrategyPage(props: EditStrategyPageProps) {
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isRunLoading, setIsRunLoading] = useState(false);

  const [phasesResult, setPhasesResult] = useState<RunResultDTOPhase[]>([]);

  const [form] = useForm();

  const onEdit = async (strategy: StrategyDTO): Promise<boolean> => {
    setIsUpdateLoading(true);

    const { error } = await api.client.updateStrategy(
      props.strategy._id,
      strategy,
    );

    setIsUpdateLoading(false);

    if (error) {
      notification.error({
        message: 'Failed to update the strategy',
        description: error,
      });

      return false;
    }

    notification.success({
      message: 'Successfully updated the strategy',
    });

    return true;
  };

  const onRun = async () => {
    setIsRunLoading(true);

    try {
      const strategyData = await form.validateFields();

      if (await onEdit(strategyData)) {
        const { data, error } = await api.client.runStrategy(
          props.strategy._id,
        );

        if (error) {
          notification.error({
            message: 'Failed to run the strategy',
            description: error,
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (data!.phases.some((phase) => phase.status != 0)) {
            notification.warning({
              message: 'An error occured while running the strategy',
            });
          } else {
            notification.success({
              message: 'Successfully runned the strategy',
            });
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setPhasesResult(data!.phases);
        }
      }
    } catch {}

    setIsRunLoading(false);
  };

  return (
    <Page title="Strategies" subTitle="Edit a strategy">
      <Form form={form} onFinish={onEdit} initialValues={props.strategy}>
        <FormItem
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the strategy's name!" },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="Language"
          name="language"
          rules={[
            {
              required: true,
              message: "Please specify the strategy's language!",
            },
          ]}
        >
          <Select>
            {props.languages.map((language) => (
              <Select.Option
                value={language._id}
                key={`strategy-language-${language._id}`}
              >
                {language.name}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="Files" name="files" wrapperCol={{ span: 24 }}>
          <FormEditor height="800px" />
        </FormItem>
        <Row justify="end">
          <Space>
            <FormItem>
              <Button
                type="default"
                disabled={!isRunLoading && isUpdateLoading}
                loading={isRunLoading && !isUpdateLoading}
                onClick={onRun}
              >
                Update and Run
              </Button>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                disabled={!isUpdateLoading && isRunLoading}
                loading={isUpdateLoading && !isRunLoading}
                htmlType="submit"
              >
                Update
              </Button>
            </FormItem>
          </Space>
        </Row>
        <Row>
          <Col span={4} />
          <Col span={20}>
            <Space direction="vertical" style={{ width: '100%' }}>
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
                        <p>{phaseResult.stdout}</p>

                        <Divider />
                      </>
                    )}

                    {!phaseResult.stderr ? null : (
                      <>
                        <Typography.Title level={3}>stderr</Typography.Title>
                        <p>{phaseResult.stderr}</p>
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
            </Space>
          </Col>
        </Row>
      </Form>
    </Page>
  );
}
