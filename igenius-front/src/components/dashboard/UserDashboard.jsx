import React from "react";
import { motion } from "framer-motion";
import { User, Calendar, FileText, Bell, Settings } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export const UserDashboard = () => {
  const { user } = useAuthStore();

  const features = [
    {
      icon: User,
      label: "Profile",
      description: "Manage your personal information",
      color: "blue",
    },
    {
      icon: Calendar,
      label: "Schedule",
      description: "View your appointments",
      color: "green",
    },
    {
      icon: FileText,
      label: "Documents",
      description: "Access your files",
      color: "purple",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Check your alerts",
      color: "orange",
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your account today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="card p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg bg-${feature.color}-100 mr-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.label}
              </h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 mt-6"
      >
        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-gray-600">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-gray-600">Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-gray-600">Messages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-gray-600">Notifications</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
