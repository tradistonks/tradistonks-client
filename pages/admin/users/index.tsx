import { Button, Input, Modal, notification, Space, Switch, Table } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Form, { FormList } from '../../../components/atoms/Form/Form';
import FormItem from '../../../components/atoms/FormItem/FormItem';
import Page, { PagePropsUser } from '../../../components/templates/Page/Page';
import { APIExternal, APIInternal } from '../../../utils/api';
import { PermissionDTO } from '../../../utils/dto/permission.dto';
import { RoleDTO } from '../../../utils/dto/role.dto';
import { UserDTO } from '../../../utils/dto/user.dto';
import { MaybeErrorProps } from '../../../utils/maybe-error-props';

export const getServerSideProps: GetServerSideProps<
  MaybeErrorProps<UsersPageProps>
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
        users: await api.getUsers(),
        roles: await api.getRoles(),
        permissions: await api.getPermissions(),
      },
    };
  } catch (error) {
    return api.errorToServerSideProps(error);
  }
};

type UsersPageProps = PagePropsUser & {
  users: UserDTO[];
  roles: RoleDTO[];
  permissions: PermissionDTO[];
};

export default function UsersPage(props: UsersPageProps) {
  const api = new APIExternal();

  const [users, setUsers] = useState(props.users);

  const [editUserId, setEditUserId] = useState('');
  const [editUserForm] = useForm<UserDTO>();
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [isEditUserLoading, setIsEditUserLoading] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState('');
  const [isDeleteUserModalVisible, setIsDeleteUserModalVisible] =
    useState(false);
  const [isDeleteUserLoading, setIsDeleteUserLoading] = useState(false);

  const onEdit = async (user: Omit<UserDTO, '_id'>) => {
    setIsEditUserLoading(true);

    try {
      const data = await api.updateUser(editUserId, user);

      setUsers((values) => {
        const index = values.findIndex((value) => value._id === editUserId);

        return [...values.slice(0, index), data, ...values.slice(index + 1)];
      });

      notification.success({
        message: 'Successfully updated the user',
      });

      setIsEditUserModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to update the user',
        description: api.errorToString(error),
      });
    }

    setIsEditUserLoading(false);
  };

  const onDelete = async () => {
    setIsDeleteUserLoading(true);

    try {
      await api.deleteUser(deleteUserId);

      setUsers(users.filter((value) => value._id !== deleteUserId));

      notification.success({
        message: 'Successfully deleted the user',
      });

      setIsDeleteUserModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Failed to delete the user',
        description: api.errorToString(error),
      });
    }

    setIsDeleteUserLoading(false);
  };

  return (
    <Page currentUser={props.currentUser} title="Users" subTitle="">
      <Table
        dataSource={users}
        columns={[
          {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
          },
          {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            // eslint-disable-next-line react/display-name
            render: (_, user) => (
              <ul
                key={`user-${user._id}-roles`}
                style={{
                  paddingLeft: '1em',
                }}
              >
                {props.roles
                  .filter((role) => user.roles.includes(role._id))
                  .map((role) => (
                    <li key={`user-${user._id}-roles-${role._id}`}>
                      {role.name}
                    </li>
                  ))}
              </ul>
            ),
          },
          {
            title: 'Permissions',
            key: 'permissions',
            // eslint-disable-next-line react/display-name
            render: (_, user) => (
              <ul
                key={`user-${user._id}-permissions`}
                style={{
                  paddingLeft: '1em',
                }}
              >
                {props.permissions
                  .filter((permission) => {
                    const roles = props.roles.filter((role) =>
                      user.roles.includes(role._id),
                    );

                    return roles.some((role) =>
                      role.permissions.includes(permission._id),
                    );
                  })
                  .map((permission) => (
                    <li key={`user-${user._id}-permissions-${permission._id}`}>
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
            render: (_, user) => (
              <Space key={`user-${user._id}-actions`}>
                <Button
                  type="primary"
                  onClick={() => {
                    editUserForm.setFieldsValue(user);
                    setEditUserId(user._id);
                    setIsEditUserModalVisible(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="default"
                  danger
                  onClick={() => {
                    setDeleteUserId(user._id);
                    setIsDeleteUserModalVisible(true);
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
        title="Edit user"
        visible={isEditUserModalVisible}
        okText="Edit"
        okButtonProps={{
          loading: isEditUserLoading,
        }}
        onOk={() => editUserForm.submit()}
        onCancel={() => setIsEditUserModalVisible(false)}
      >
        <Form form={editUserForm} onFinish={onEdit}>
          <FormItem
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input the user's username!",
              },
            ]}
          >
            <Input />
          </FormItem>

          <FormItem
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input the user's username!",
              },
            ]}
          >
            <Input type="email" />
          </FormItem>

          <FormList name="roles">
            {(_, { add, remove }) => (
              <>
                {props.roles.map((role) => {
                  const index = editUserForm
                    .getFieldValue('roles')
                    .findIndex((value: string) => value === role._id);

                  return (
                    <FormItem key={`edit-form-roles-${role._id}`}>
                      <Space>
                        <Switch
                          checked={index !== -1}
                          onChange={() => {
                            if (index !== -1) {
                              remove(index);
                            } else {
                              add(role._id);
                            }
                          }}
                        />
                        <span>{role.name}</span>
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
        visible={isDeleteUserModalVisible}
        okText="Delete"
        okButtonProps={{
          loading: isDeleteUserLoading,
        }}
        onOk={() => onDelete()}
        onCancel={() => setIsDeleteUserModalVisible(false)}
      >
        <p>Are you sure to delete this role?</p>
      </Modal>
    </Page>
  );
}
