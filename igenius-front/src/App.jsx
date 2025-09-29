import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Loader } from "./components/ui/Loader";

// Layout Components
import { AuthPage } from "./Pages/AuthPage";

// Page Components
import { DashboardPage } from "./Pages/DashboardPage";

import Layout from "./Layout/Layout";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { ExamFlow } from "./Pages/ExamFlow";
import { UserManagement } from "./components/admin/UserManagement";

function App() {
  const { fetchUser, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/auth"
            element={
              !isAuthenticated ? (
                <AuthPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard based on role */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Exam Flow Routes */}
            <Route path="levels" element={<ExamFlow view="levels" />} />
            <Route
              path="levels/:level/weeks"
              element={<ExamFlow view="weeks" />}
            />
            <Route
              path="levels/:level/weeks/:week/questions"
              element={<ExamFlow view="question-sets" />}
            />

            {/* Admin Only Routes */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<UserManagement />} />

            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
