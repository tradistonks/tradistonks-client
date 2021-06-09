import { Button, Input, notification, Row } from 'antd';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { FormEditor } from '../../../components/atoms/Editor/Editor';
import { SingleFileFormEditor } from '../../../components/atoms/Editor/SingleFileEditor';
import Form from '../../../components/atoms/Form/Form';
import FormItem from '../../../components/atoms/FormItem/FormItem';
import Page from '../../../components/templates/Page/Page';
import * as api from '../../../utils/api';
import { ApiError } from '../../../utils/api-error';
import { ServerSideAPI } from '../../../utils/api.server';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<EditLanguagePageProps>
> = async (context) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const languageId = context.params!.id as string;
    const server_api = new ServerSideAPI(context);

    const language = await server_api.getLanguage(languageId);

    if (!language) {
      return {
        props: {
          error: new ApiError(404, "This language doesn't exists"),
        },
      };
    }

    return {
      props: {
        language,
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

type EditLanguagePageProps = {
  language: LanguageDTO;
};

export default function EditLanguagePage(props: EditLanguagePageProps) {
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const onEdit = async (language: Omit<LanguageDTO, '_id'>) => {
    setIsUpdateLoading(true);

    const { error } = await api.client.updateLanguage(
      props.language._id,
      language,
    );

    setIsUpdateLoading(false);

    if (error) {
      notification.error({
        message: 'Failed to update the language',
        description: error,
      });
    } else {
      notification.success({
        message: 'Successfully updated the language',
      });
    }
  };

  return (
    <Page title="Languages" subTitle="Edit a language">
      <Form onFinish={onEdit} initialValues={props.language}>
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
            <Button type="primary" loading={isUpdateLoading} htmlType="submit">
              Update
            </Button>
          </FormItem>
        </Row>
      </Form>
    </Page>
  );
}
