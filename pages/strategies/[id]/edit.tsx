import { Button, Input, notification, Select } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import { FormEditor } from '../../../components/atoms/Editor/Editor';
import Form from '../../../components/atoms/Form/Form';
import FormItem from '../../../components/atoms/FormItem/FormItem';
import Page from '../../../components/templates/Page/Page';
import { StrategyDTO } from '../../../types/dto/strategy.dto';
import * as api from '../../../utils/api';
import { ApiError } from '../../../utils/api-error';
import { ServerSideAPI } from '../../../utils/api.server';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';
import styles from './edit.module.scss';

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
  const onEdit = async (strategy: StrategyDTO) => {
    const { error } = await api.client.updateStrategy(
      props.strategy._id,
      strategy,
    );

    if (error) {
      notification.error({
        message: 'Failed to update the strategy',
        description: error,
      });
    } else {
      notification.success({
        message: 'Successfully updated the strategy',
      });
    }
  };

  return (
    <Page title="Strategies" subTitle="Edit a strategy">
      <Form onFinish={onEdit} initialValues={props.strategy}>
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
        <FormItem name="files" wrapperCol={{ span: 24 }}>
          <FormEditor height="800px" />
        </FormItem>
        <FormItem
          wrapperCol={{ span: 24 }}
          className={styles['submit-button-wrapper']}
        >
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </FormItem>
      </Form>
    </Page>
  );
}
