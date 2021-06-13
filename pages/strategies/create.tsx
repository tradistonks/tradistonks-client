import { Button, notification } from 'antd';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import Page, { PagePropsUser } from '../../components/templates/Page/Page';
import { StrategyForm } from '../../components/templates/StrategyForm/StrategyForm';
import { APIExternal, APIInternal } from '../../utils/api';
import { LanguageDTO } from '../../utils/dto/language.dto';
import { StrategyDTO } from '../../utils/dto/strategy.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<CreateStrategyPageProps>
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
        languages: await api.getLanguages(),
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type CreateStrategyPageProps = PagePropsUser & {
  languages: Pick<LanguageDTO, '_id' | 'name'>[];
};

export default function CreateStrategyPage(props: CreateStrategyPageProps) {
  const api = new APIExternal();

  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const onCreate = async (strategy: StrategyDTO) => {
    setIsCreateLoading(true);

    try {
      const data = await api.createStrategy(strategy);

      notification.success({
        message: 'Successfully created the strategy',
      });

      Router.push(`/strategies/${data._id}/edit`);
    } catch (error) {
      notification.error({
        message: 'Failed to create the strategy',
        description: api.errorToString(error),
      });
    }

    setIsCreateLoading(false);
  };

  return (
    <Page
      currentUser={props.currentUser}
      title="Strategies"
      subTitle="Create a strategy"
    >
      <StrategyForm
        onFinish={onCreate}
        languages={props.languages}
        actions={[
          <Button
            key="action-create"
            type="primary"
            loading={isCreateLoading}
            htmlType="submit"
          >
            Create
          </Button>,
        ]}
      />
    </Page>
  );
}
