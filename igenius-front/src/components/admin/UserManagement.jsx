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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { adminAPI } from "../../services/api";

const { Option } = Select;

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

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
      // This would call a new admin-only endpoint
      const response = await adminAPI.createUser(values);
      message.success("User created successfully");
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to create user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
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
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
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
          >
            Create User
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
        />

        <Modal
          title="Create New User"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateUser}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select>
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Create User
                </Button>
                <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};
