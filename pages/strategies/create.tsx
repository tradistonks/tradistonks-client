import { Button, Input, notification, Row, Select } from 'antd';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { FormEditor } from '../../components/atoms/Editor/Editor';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page, { PagePropsUser } from '../../components/templates/Page/Page';
import { StrategyDTO } from '../../utils/dto/strategy.dto';
import { APIExternal, APIInternal } from '../../utils/api';
import { LanguageDTO } from '../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<CreateStrategyPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    const currentUser = await api.getCurrentUser().catch(() => null);

    if (!currentUser) {
      return api.createErrorServerSideProps(401, 'Unauthorize');
    }

    return {
      props: {
        currentUser,
        languages: await api.getLanguages(),
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type CreateStrategyPageProps = PagePropsUser & {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
};

export default function CreateStrategyPage(props: CreateStrategyPageProps) {
  const api = new APIExternal();

  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const onCreate = async (strategy: StrategyDTO) => {
    setIsCreateLoading(true);

    try {
      const data = await api.createStrategy(strategy);

      notification.success({
        message: 'Successfully created the strategy',
      });

      Router.push(`/strategies/${data._id}/edit`);
    } catch (error) {
      notification.error({
        message: 'Failed to create the strategy',
        description: api.errorToString(error),
      });
    }

    setIsCreateLoading(false);
  };

  return (
    <Page
      currentUser={props.currentUser}
      title="Strategies"
      subTitle="Create a strategy"
    >
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
