import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Form, Alert, Card } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";

export const LoginForm = ({ onToggleMode }) => {
  const [form] = Form.useForm();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (values) => {
    console.log("🎯 Login form submitted:", values);
    await login(values.email, values.password);
  };

  const handleValuesChange = () => {
    if (error) clearError();
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
            <div className="p-3 bg-blue-100 rounded-full">
              <LoginOutlined className="text-blue-600 text-2xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
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
                message="Login Error"
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

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              className="rounded-lg py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full h-12 rounded-lg text-base font-medium bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
              icon={<LoginOutlined />}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
