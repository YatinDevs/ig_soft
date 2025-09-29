import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
