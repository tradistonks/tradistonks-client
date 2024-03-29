import { Button, Table } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import Page, { PagePropsUser } from '../../../components/templates/Page/Page';
import { APIInternal } from '../../../utils/api';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<LanguagesPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    const currentUser = await api
      .getCurrentUserWithPermissions()
      .catch(() => null);

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

type LanguagesPageProps = PagePropsUser & {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
};

export default function LanguagesPage(props: LanguagesPageProps) {
  return (
    <Page
      currentUser={props.currentUser}
      title="Languages"
      subTitle=""
      extra={
        <Button type="primary" href="/admin/languages/create">
          Add a language
        </Button>
      }
    >
      <Table
        dataSource={props.languages}
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
              <Button
                key={`actions-${_id}`}
                type="primary"
                href={`/admin/languages/${_id}/edit`}
              >
                Edit
              </Button>
            ),
          },
        ]}
      />
    </Page>
  );
}
