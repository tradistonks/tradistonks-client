import { Button, Input, Modal, notification, Space, Table } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Form from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page, { PagePropsUser } from '../../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../../utils/api';
import { PermissionDTO } from '../../utils/dto/permission.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<PermissionsPageProps>
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
        permissions: await api.getPermissions(),
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type PermissionsPageProps = PagePropsUser & {
  permissions: PermissionDTO[];
};

export default function PermissionsPage(props: PermissionsPageProps) {
  const api = new APIExternal();

  const [permissions, setPermissions] = useState(props.permissions);

  const [newPermissionForm] = useForm<Omit<PermissionDTO, '_id'>>();
  const [isNewPermissionModalVisible, setIsNewPermissionModalVisible] =
    useState(false);
  const [isNewPermissionLoading, setIsNewPermissionLoading] = useState(false);

  const [editPermissionId, setEditPermissionId] = useState('');
  const [editPermissionForm] = useForm<PermissionDTO>();
  const [isEditPermissionModalVisible, setIsEditPermissionModalVisible] =
    useState(false);
  const [isEditPermissionLoading, setIsEditPermissionLoading] = useState(false);

  const [deletePermissionId, setDeletePermissionId] = useState('');
  const [isDeletePermissionModalVisible, setIsDeletePermissionModalVisible] =
    useState(false);
  const [isDeletePermissionLoading, setIsDeletePermissionLoading] =
    useState(false);

  const onCreate = async (permission: Omit<PermissionDTO, '_id'>) => {
    setIsNewPermissionLoading(true);

    try {
      const data = await api.createPermission(permission);
      setPermissions([...permissions, data]);

      notification.success({
        message: 'Successfully created the permission',
      });

      setIsNewPermissionModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to create the permission',
        description: api.errorToString(error),
      });
    }

    setIsNewPermissionLoading(false);
  };

  const onEdit = async (permission: Omit<PermissionDTO, '_id'>) => {
    setIsEditPermissionLoading(true);

    try {
      const data = await api.updatePermission(editPermissionId, permission);

      setPermissions((values) => {
        const index = values.findIndex(
          (value) => value._id === editPermissionId,
        );

        return [...values.slice(0, index), data, ...values.slice(index + 1)];
      });

      notification.success({
        message: 'Successfully updated the permission',
      });

      setIsEditPermissionModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to update the permission',
        description: api.errorToString(error),
      });
    }

    setIsEditPermissionLoading(false);
  };

  const onDelete = async () => {
    setIsDeletePermissionLoading(true);

    try {
      await api.deletePermission(deletePermissionId);

      setPermissions(
        permissions.filter((value) => value._id !== deletePermissionId),
      );

      notification.success({
        message: 'Successfully deleted the permission',
      });

      setIsDeletePermissionModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to delete the permission',
        description: api.errorToString(error),
      });
    }

    setIsDeletePermissionLoading(false);
  };

  return (
    <Page
      currentUser={props.currentUser}
      title="Permissions"
      subTitle=""
      extra={
        <Button
          type="primary"
          onClick={() => setIsNewPermissionModalVisible(true)}
        >
          New permission
        </Button>
      }
    >
      <Table
        dataSource={permissions}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
          },
          {
            title: 'Actions',
            key: 'actions',
            // eslint-disable-next-line react/display-name
            render: (permission, { _id }) => (
              <Space>
                <Button
                  key={`actions-${_id}-edit`}
                  type="primary"
                  onClick={() => {
                    editPermissionForm.setFieldsValue(permission);
                    setEditPermissionId(_id);
                    setIsEditPermissionModalVisible(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  key={`actions-${_id}-remove`}
                  type="default"
                  danger
                  onClick={() => {
                    setDeletePermissionId(_id);
                    setIsDeletePermissionModalVisible(true);
                  }}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="New permission"
        visible={isNewPermissionModalVisible}
        okText="Create"
        okButtonProps={{
          loading: isNewPermissionLoading,
        }}
        onOk={() => newPermissionForm.submit()}
        onCancel={() => setIsNewPermissionModalVisible(false)}
      >
        <Form form={newPermissionForm} onFinish={onCreate}>
          <FormItem
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the permission's name!",
              },
            ]}
          >
            <Input />
          </FormItem>

          <FormItem
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input the permission's code!",
              },
            ]}
          >
            <Input />
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="Edit permission"
        visible={isEditPermissionModalVisible}
        okText="Edit"
        okButtonProps={{
          loading: isEditPermissionLoading,
        }}
        onOk={() => editPermissionForm.submit()}
        onCancel={() => setIsEditPermissionModalVisible(false)}
      >
        <Form form={editPermissionForm} onFinish={onEdit}>
          <FormItem
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the permission's name!",
              },
            ]}
          >
            <Input />
          </FormItem>

          <FormItem
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input the permission's code!",
              },
            ]}
          >
            <Input />
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="Delete permission"
        visible={isDeletePermissionModalVisible}
        okText="Delete"
        okButtonProps={{
          loading: isDeletePermissionLoading,
        }}
        onOk={() => onDelete()}
        onCancel={() => setIsDeletePermissionModalVisible(false)}
      >
        <p>Are you sure to delete this permission?</p>
      </Modal>
    </Page>
  );
}
