import { Button, Input, Modal, notification, Space, Switch, Table } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Form, { FormList } from '../../components/atoms/Form/Form';
import FormItem from '../../components/atoms/FormItem/FormItem';
import Page, { PagePropsUser } from '../../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../../utils/api';
import { PermissionDTO } from '../../utils/dto/permission.dto';
import { RoleDTO } from '../../utils/dto/role.dto';
import { MaybeErrorProps } from '../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<RolesPageProps>
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
        roles: await api.getRoles(),
        permissions: await api.getPermissions(),
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type RolesPageProps = PagePropsUser & {
  roles: RoleDTO[];
  permissions: PermissionDTO[];
};

export default function RolesPage(props: RolesPageProps) {
  const api = new APIExternal();

  const [roles, setRoles] = useState(props.roles);

  const [newRoleForm] = useForm<Omit<RoleDTO, '_id'>>();
  const [isNewRoleModalVisible, setIsNewRoleModalVisible] = useState(false);
  const [isNewRoleLoading, setIsNewRoleLoading] = useState(false);

  const [editRoleId, setEditRoleId] = useState('');
  const [editRoleForm] = useForm<RoleDTO>();
  const [isEditRoleModalVisible, setIsEditRoleModalVisible] = useState(false);
  const [isEditRoleLoading, setIsEditRoleLoading] = useState(false);

  const [deleteRoleId, setDeleteRoleId] = useState('');
  const [isDeleteRoleModalVisible, setIsDeleteRoleModalVisible] =
    useState(false);
  const [isDeleteRoleLoading, setIsDeleteRoleLoading] = useState(false);

  const onCreate = async (role: Omit<RoleDTO, '_id'>) => {
    setIsNewRoleLoading(true);

    try {
      const data = await api.createRole(role);
      setRoles([...roles, data]);

      notification.success({
        message: 'Successfully created the role',
      });

      setIsNewRoleModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to create the role',
        description: api.errorToString(error),
      });
    }

    setIsNewRoleLoading(false);
  };

  const onEdit = async (role: Omit<RoleDTO, '_id'>) => {
    setIsEditRoleLoading(true);

    try {
      const data = await api.updateRole(editRoleId, role);

      setRoles((values) => {
        const index = values.findIndex((value) => value._id === editRoleId);

        return [...values.slice(0, index), data, ...values.slice(index + 1)];
      });

      notification.success({
        message: 'Successfully updated the role',
      });

      setIsEditRoleModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to update the role',
        description: api.errorToString(error),
      });
    }

    setIsEditRoleLoading(false);
  };

  const onDelete = async () => {
    setIsDeleteRoleLoading(true);

    try {
      await api.deleteRole(deleteRoleId);

      setRoles(roles.filter((value) => value._id !== deleteRoleId));

      notification.success({
        message: 'Successfully deleted the role',
      });

      setIsDeleteRoleModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to delete the role',
        description: api.errorToString(error),
      });
    }

    setIsDeleteRoleLoading(false);
  };

  return (
    <Page
      currentUser={props.currentUser}
      title="Roles"
      subTitle=""
      extra={
        <Button type="primary" onClick={() => setIsNewRoleModalVisible(true)}>
          New role
        </Button>
      }
    >
      <Table
        dataSource={roles}
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            // eslint-disable-next-line react/display-name
            render: (_, role) => (
              <ul
                key={`role-${role._id}-permissions`}
                style={{
                  paddingLeft: '1em',
                }}
              >
                {props.permissions
                  .filter((permission) =>
                    role.permissions.includes(permission._id),
                  )
                  .map((permission) => (
                    <li key={`role-${role._id}-permissions-${permission._id}`}>
                      {permission.name} ({permission.code})
                    </li>
                  ))}
              </ul>
            ),
          },
          {
            title: 'Actions',
            key: 'actions',
            // eslint-disable-next-line react/display-name
            render: (_, role) => (
              <Space key={`role-${role._id}-actions`}>
                <Button
                  type="primary"
                  onClick={() => {
                    editRoleForm.setFieldsValue(role);
                    setEditRoleId(role._id);
                    setIsEditRoleModalVisible(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="default"
                  danger
                  onClick={() => {
                    setDeleteRoleId(role._id);
                    setIsDeleteRoleModalVisible(true);
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
        title="New role"
        visible={isNewRoleModalVisible}
        okText="Create"
        okButtonProps={{
          loading: isNewRoleLoading,
        }}
        onOk={() => newRoleForm.submit()}
        onCancel={() => setIsNewRoleModalVisible(false)}
      >
        <Form
          form={newRoleForm}
          initialValues={{
            permissions: [],
          }}
          onFinish={onCreate}
        >
          <FormItem
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the role's name!",
              },
            ]}
          >
            <Input />
          </FormItem>

          <FormList name="permissions">
            {(fields, { add, remove }) => (
              <>
                {props.permissions.map((permission) => {
                  const index = newRoleForm
                    .getFieldValue('permissions')
                    .findIndex((value: string) => value === permission._id);

                  return (
                    <FormItem key={`new-form-permissions-${permission._id}`}>
                      <Space>
                        <Switch
                          checked={index !== -1}
                          onChange={() => {
                            if (index !== -1) {
                              remove(index);
                            } else {
                              add(permission._id);
                            }
                          }}
                        />
                        <span>
                          {permission.name} ({permission.code})
                        </span>
                      </Space>
                    </FormItem>
                  );
                })}
              </>
            )}
          </FormList>
        </Form>
      </Modal>

      <Modal
        title="Edit role"
        visible={isEditRoleModalVisible}
        okText="Edit"
        okButtonProps={{
          loading: isEditRoleLoading,
        }}
        onOk={() => editRoleForm.submit()}
        onCancel={() => setIsEditRoleModalVisible(false)}
      >
        <Form form={editRoleForm} onFinish={onEdit}>
          <FormItem
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the role's name!",
              },
            ]}
          >
            <Input />
          </FormItem>

          <FormList name="permissions">
            {(fields, { add, remove }) => (
              <>
                {props.permissions.map((permission) => {
                  const index = editRoleForm
                    .getFieldValue('permissions')
                    .findIndex((value: string) => value === permission._id);

                  return (
                    <FormItem key={`edit-form-permissions-${permission._id}`}>
                      <Space>
                        <Switch
                          checked={index !== -1}
                          onChange={() => {
                            if (index !== -1) {
                              remove(index);
                            } else {
                              add(permission._id);
                            }
                          }}
                        />
                        <span>
                          {permission.name} ({permission.code})
                        </span>
                      </Space>
                    </FormItem>
                  );
                })}
              </>
            )}
          </FormList>
        </Form>
      </Modal>

      <Modal
        title="Delete role"
        visible={isDeleteRoleModalVisible}
        okText="Delete"
        okButtonProps={{
          loading: isDeleteRoleLoading,
        }}
        onOk={() => onDelete()}
        onCancel={() => setIsDeleteRoleModalVisible(false)}
      >
        <p>Are you sure to delete this role?</p>
      </Modal>
    </Page>
  );
}
