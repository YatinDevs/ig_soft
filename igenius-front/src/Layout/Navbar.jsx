import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Practice Exams", href: "/levels", icon: BookOpen },
  ];

  const adminNavigationItems = [
    { name: "Admin Dashboard", href: "/admin", icon: BarChart3 },
    { name: "User Management", href: "/admin/users", icon: Users },
  ];

  const allNavigationItems = isAdmin()
    ? [...navigationItems, ...adminNavigationItems]
    : navigationItems;

  const isActivePath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">Exam Prep</h1>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {allNavigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700 block">
                    {user?.name}
                  </span>
                  <span className="text-xs text-gray-500 capitalize block">
                    {user?.role}
                  </span>
                </div>
              </div>
              {isAdmin() && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  Admin
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4 space-y-4"
            >
              {/* Mobile Navigation */}
              <div className="space-y-2">
                {allNavigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActivePath(item.href)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile User Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center mb-4">
                  <p className="text-gray-700 font-medium">{user?.name}</p>
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <p className="text-sm text-gray-600 capitalize">
                      {user?.role}
                    </p>
                    {isAdmin() && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
