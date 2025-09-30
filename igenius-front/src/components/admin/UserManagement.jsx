import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { adminAPI } from "../../services/api";

const { Option } = Select;

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (values) => {
    try {
      await adminAPI.createUser(values);
      message.success("User created successfully");
      setModalVisible(false);
      createForm.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to create user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdateUser = async (values) => {
    try {
      await adminAPI.updateUser(editingUser.id, values);
      message.success("User updated successfully");
      setEditingUser(null);
      editForm.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to delete user");
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    editForm.resetFields();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        editingUser?.id === record.id ? (
          <Form.Item
            name="name"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) =>
        editingUser?.id === record.id ? (
          <Form.Item
            name="email"
            style={{ margin: 0 }}
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role, record) =>
        editingUser?.id === record.id ? (
          <Form.Item
            name="role"
            style={{ margin: 0 }}
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        ) : (
          <Tag color={role === "admin" ? "purple" : "blue"}>
            {role.toUpperCase()}
          </Tag>
        ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {editingUser?.id === record.id ? (
            <>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => editForm.submit()}
                size="small"
              >
                Save
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={cancelEdit}
                size="small"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditUser(record)}
                disabled={editingUser !== null}
              >
                Edit
              </Button>
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => handleDeleteUser(record.id)}
                okText="Yes"
                cancelText="No"
                disabled={editingUser !== null}
              >
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={editingUser !== null}
                >
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="User Management"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            disabled={editingUser !== null}
          >
            Create User
          </Button>
        }
      >
        <Form form={editForm} onFinish={handleUpdateUser}>
          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey="id"
            scroll={{ x: 800 }}
          />
        </Form>

        {/* Create User Modal */}
        <Modal
          title="Create New User"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            createForm.resetFields();
          }}
          footer={null}
          destroyOnClose
        >
          <Form form={createForm} layout="vertical" onFinish={handleCreateUser}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select placeholder="Select role">
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Create User
                </Button>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    createForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};
