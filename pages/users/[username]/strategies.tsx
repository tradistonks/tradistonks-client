import { Button, Table } from 'antd';
import { GetServerSideProps } from 'next';
import React from 'react';
import Page from '../../../components/templates/Page/Page';
import { StrategyDTO } from '../../../utils/dto/strategy.dto';
import { APIInternal } from '../../../utils/api';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import { UserDTO } from '../../../utils/dto/user.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<UserStrategiesPageProps>
> = async (context) => {
  const api = new APIInternal(context);

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const username = context.params!.username as string;

    return {
      props: {
        languages: await api.getLanguages(),
        user: await api.getUser(username),
        strategies: await api.getUserStrategies(username),
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type UserStrategiesPageProps = {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
  user: UserDTO;
  strategies: StrategyDTO[];
};

export default function UserStrategiesPage(props: UserStrategiesPageProps) {
  return (
    <Page
      title="Strategies"
      subTitle={props.user.username}
      extra={
        <Button type="primary" href="/strategies/create">
          Create a strategy
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
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            render: (id) =>
              props.languages.find((language) => language._id === id)?.name ??
              '?',
          },
          {
            title: 'Actions',
            key: 'actions',
            // eslint-disable-next-line react/display-name
            render: (_, { _id }) => (
              <Button type="primary" href={`/strategies/${_id}/edit`}>
                Edit
              </Button>
            ),
          },
        ]}
        dataSource={props.strategies}
      />
    </Page>
  );
}
