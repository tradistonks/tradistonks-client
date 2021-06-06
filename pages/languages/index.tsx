import { Button, Table } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import Page from '../../components/templates/Page/Page';
import { ApiError } from '../../utils/api-error';
import { ServerSideAPI } from '../../utils/api.server';
import { LanguageDTO } from '../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<LanguagesPageProps>
> = async (context) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

type LanguagesPageProps = {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
};

export default function LanguagesPage(props: LanguagesPageProps) {
  return (
    <Page
      title="Languages"
      subTitle=""
      extra={
        <Button type="primary" href="/languages/create">
          Add a language
        </Button>
      }
    >
      <Table
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
          },
          {
            title: 'Actions',
            key: 'actions',
            // eslint-disable-next-line react/display-name
            render: (_, { _id }) => (
              <Button type="primary" href={`/languages/${_id}/edit`}>
                Edit
              </Button>
            ),
          },
        ]}
        dataSource={props.languages}
      />
    </Page>
  );
}
