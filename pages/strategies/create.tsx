import { Button, Input, notification, Row, Select } from 'antd';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { FormEditor } from '../../components/atoms/Editor/Editor';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import { StrategyDTO } from '../../types/dto/strategy.dto';
import * as api from '../../utils/api';
import { ApiError } from '../../utils/api-error';
import { ServerSideAPI } from '../../utils/api.server';
import { LanguageDTO } from '../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<CreateStrategyPageProps>
> = async (context) => {
  try {
    const server_api = new ServerSideAPI(context);

    return {
      props: {
        languages: await server_api.getLanguages(),
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

type CreateStrategyPageProps = {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
};

export default function CreateStrategyPage(props: CreateStrategyPageProps) {
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const onCreate = async (strategy: StrategyDTO) => {
    setIsCreateLoading(true);

    const { data, error } = await api.client.createStrategy(strategy);

    setIsCreateLoading(false);

    if (error) {
      notification.error({
        message: 'Failed to create the strategy',
        description: error,
      });
    } else {
      notification.success({
        message: 'Successfully created the strategy',
      });

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Router.push(`/strategies/${data!._id}/edit`);
    }
  };

  return (
    <Page title="Strategies" subTitle="Create a strategy">
      <Form onFinish={onCreate}>
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
          <FormItem>
            <Button type="primary" loading={isCreateLoading} htmlType="submit">
              Create
            </Button>
          </FormItem>
        </Row>
      </Form>
    </Page>
  );
}
