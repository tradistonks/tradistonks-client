import { Input, Select } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page from '../../components/templates/Page/Page';
import { hasErrorProps, MaybeErrorProps } from '../../utils/maybe-error-props';
import { ServerSideAPI } from '../../utils/api.server';
import { LanguageDTO } from '../../utils/dto/language.dto';
import Error from 'next/error';
import { ApiError } from '../../utils/api-error';

export const getServerSideProps: GetServerSideProps<CreateStrategyPageProps> =
  async (context) => {
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

type CreateStrategyPageProps = MaybeErrorProps<{
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
}>;

export default function CreateStrategyPage(props: CreateStrategyPageProps) {
  if (hasErrorProps(props)) {
    return (
      <Error statusCode={props.error.status} title={props.error.message} />
    );
  }

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
      </Form>
    </Page>
  );
}
