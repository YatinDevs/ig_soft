import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";

export const AuthPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-600/10 rounded-b-[50%] transform scale-150" />

      {/* Only show login form - no toggle option */}
      <LoginForm />
    </div>
  );
};
