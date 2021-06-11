import { Button, Input, notification, Row } from 'antd';
import Router from 'next/router';
import React, { useState } from 'react';
import { FormEditor } from '../../components/atoms/Editor/Editor';
import { SingleFileFormEditor } from '../../components/atoms/Editor/SingleFileEditor';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import { APIExternal } from '../../utils/api';
import { LanguageDTO } from '../../utils/dto/language.dto';

export default function CreateLanguagePage() {
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
    <Page title="Languages" subTitle="Create a language">
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
