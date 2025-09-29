import React from "react";
import { useAuthStore } from "../store/authStore";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";
import { UserDashboard } from "../components/dashboard/UserDashboard";

export const DashboardPage = () => {
  const { isAdmin } = useAuthStore();

  return isAdmin() ? <AdminDashboard /> : <UserDashboard />;
};
