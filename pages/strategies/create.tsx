import { Button, Input, Select } from 'antd';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Editor, {
  EditorOnChange,
  setFileCode,
} from '../../components/atoms/Editor/Editor';
import { EditorFileExplorerItem } from '../../components/atoms/Editor/EditorFileExplorer';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import { ApiError } from '../../utils/api-error';
import { ServerSideAPI } from '../../utils/api.server';
import { LanguageDTO } from '../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';
import styles from './create.module.scss';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<CreateStrategyPageProps>
> = async (context) => {
  try {
    const api = new ServerSideAPI(context);

    return {
      props: {
        languages: await api.getLanguages(),
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
  const [files, setFiles] = useState<EditorFileExplorerItem[]>([]);

  const onEditorChange: EditorOnChange = (path, content) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setFiles((files) => setFileCode(files, path, content));
  };

  return (
    <Page title="Strategies" subTitle="Create a strategy">
      <Form>
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
        <FormItem wrapperCol={{ span: 24 }}>
          <Editor files={files} height="800px" onChange={onEditorChange} />
        </FormItem>
        <FormItem
          wrapperCol={{ span: 24 }}
          className={styles['submit-button-wrapper']}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    </Page>
  );
}
