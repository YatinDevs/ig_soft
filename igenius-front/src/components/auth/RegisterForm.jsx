import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Form, Alert, Card, Radio, Space } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";

export const RegisterForm = ({ onToggleMode }) => {
  const [form] = Form.useForm();
  const [role, setRole] = useState("user");
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (values) => {
    console.log("🎯 Register form submitted:", { ...values, role });
    await register({ ...values, role });
  };

  const handleValuesChange = (changedValues, allValues) => {
    if (error) clearError();
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-lg border-gray-100 rounded-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <UserAddOutlined className="text-green-600 text-2xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us today</p>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          onValuesChange={handleValuesChange}
          layout="vertical"
          size="large"
          disabled={isLoading}
        >
          {error && (
            <Form.Item>
              <Alert
                message="Registration Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={clearError}
                className="mb-4"
              />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter your full name"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your email"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item label="Account Type">
            <Radio.Group
              onChange={handleRoleChange}
              value={role}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                <Radio
                  value="user"
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <UserOutlined className="text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">User Account</div>
                      <div className="text-sm text-gray-500">
                        Basic access rights
                      </div>
                    </div>
                  </div>
                </Radio>
                <Radio
                  value="admin"
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <SafetyCertificateOutlined className="text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Admin Account</div>
                      <div className="text-sm text-gray-500">
                        Full system access
                      </div>
                    </div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Create a password"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm your password"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full h-12 rounded-lg text-base font-medium bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
              icon={<UserAddOutlined />}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
