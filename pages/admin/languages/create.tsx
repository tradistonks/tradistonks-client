import { Button, Input, notification, Row } from 'antd';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { FormEditor } from '../../../components/atoms/Editor/Editor';
import { SingleFileFormEditor } from '../../../components/atoms/Editor/SingleFileEditor';
import Form from '../../../components/atoms/Form/Form';
import FormItem from '../../../components/atoms/FormItem/FormItem';
import Page, { PagePropsUser } from '../../../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../../../utils/api';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<CreateLanguagePageProps>
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
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

export type CreateLanguagePageProps = PagePropsUser;

export default function CreateLanguagePage(props: CreateLanguagePageProps) {
  const api = new APIExternal();

  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const onCreate = async (language: Omit<LanguageDTO, '_id'>) => {
    setIsCreateLoading(true);

    try {
      const data = await api.createLanguage(language);

      notification.success({
        message: 'Successfully created the language',
      });

      Router.push(`/languages/${data._id}/edit`);
    } catch (error) {
      notification.error({
        message: 'Failed to create the language',
        description: api.errorToString(error),
      });
    }

    setIsCreateLoading(false);
  };

  return (
    <Page
      currentUser={props.currentUser}
      title="Languages"
      subTitle="Create a language"
    >
      <Form
        onFinish={onCreate}
        initialValues={{
          files: [],
        }}
      >
        <FormItem
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the language's name!" },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="Monaco Identifier"
          name="monaco_identifier"
          rules={[
            {
              required: true,
              message: "Please input the language's monaco identifier!",
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="Compile script"
          name="compile_script"
          wrapperCol={{ span: 24 }}
        >
          <SingleFileFormEditor height="500px" language="bash" />
        </FormItem>
        <FormItem
          label="Run script"
          name="run_script"
          wrapperCol={{ span: 24 }}
        >
          <SingleFileFormEditor height="500px" language="bash" />
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
