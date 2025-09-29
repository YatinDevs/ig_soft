import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, Card } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { UserManagement } from "../admin/UserManagement";

const { TabPane } = Tabs;

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <DashboardOutlined />
          Overview
        </span>
      ),
      children: <DashboardOverview />,
    },
    {
      key: "users",
      label: (
        <span>
          <TeamOutlined />
          User Management
        </span>
      ),
      children: <UserManagement />,
    },
  ];

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-6"
      >
        Admin Dashboard
      </motion.h1>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

const DashboardOverview = () => {
  // Your existing overview content
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">1,234</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Admins</h3>
          <p className="text-2xl font-bold">5</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Active Today</h3>
          <p className="text-2xl font-bold">89</p>
        </Card>
      </div>
    </div>
  );
};
