import { Button, Table } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import Page from '../../components/templates/Page/Page';
import { APIInternal } from '../../utils/api';
import { LanguageDTO } from '../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<LanguagesPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    return {
      props: {
        languages: await api.getLanguages(),
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
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
