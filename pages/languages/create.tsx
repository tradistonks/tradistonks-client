import { Button, Input, notification } from 'antd';
import Router from 'next/router';
import React from 'react';
import { FormEditor } from '../../components/atoms/Editor/Editor';
import { SingleFileFormEditor } from '../../components/atoms/Editor/SingleFileEditor';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import * as api from '../../utils/api';
import { LanguageDTO } from '../../utils/dto/language.dto';
import styles from './create.module.scss';

export default function CreateLanguagePage() {
  const onCreate = async (language: Omit<LanguageDTO, '_id'>) => {
    const { data, error } = await api.client.createLanguage(language);

    if (error) {
      notification.error({
        message: 'Failed to create the language',
        description: error,
      });
    } else {
      notification.success({
        message: 'Successfully created the language',
      });

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Router.push(`/languages/${data!._id}/edit`);
    }
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
        <FormItem
          wrapperCol={{ span: 24 }}
          className={styles['submit-button-wrapper']}
        >
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </FormItem>
      </Form>
    </Page>
  );
}
