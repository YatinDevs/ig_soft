import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI, profileAPI } from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // In your auth store, make sure the login function looks like this:
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          console.log("Attempting login with:", { email });
          const response = await authAPI.login({ email, password });
          console.log("Login API response:", response.data);

          const { user, access_token } = response.data;

          set({
            user,
            accessToken: access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          console.log("Login successful, user stored:", user);
          return { success: true, user };
        } catch (error) {
          console.error("Login API error:", error);

          let errorMessage = "Login failed";

          if (error.response) {
            // Server responded with error status
            errorMessage =
              error.response.data?.error ||
              error.response.data?.message ||
              `Server error: ${error.response.status}`;
          } else if (error.request) {
            // Request was made but no response received
            errorMessage =
              "No response from server. Please check your connection.";
          } else {
            // Something else happened
            errorMessage = error.message || "Login failed";
          }

          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });

          return { success: false, error: errorMessage };
        }
      },
      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.register(userData);
          const { user, access_token } = response.data;

          set({
            user,
            accessToken: access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } catch (error) {
          const errorData = error.response?.data;
          let errorMessage = "Registration failed";

          if (typeof errorData === "object") {
            // Handle validation errors
            const firstError = Object.values(errorData)[0];
            errorMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }

          set({
            isLoading: false,
            error: errorMessage,
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      fetchUser: async () => {
        const { accessToken } = get();
        if (!accessToken) return;

        set({ isLoading: true });

        try {
          const response = await authAPI.getUser();
          set({
            user: response.data.user,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to fetch user:", error);
          get().logout();
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await profileAPI.updateProfile(profileData);
          const updatedUser = response.data.user;

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          return { success: true, user: updatedUser };
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Profile update failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Getters
      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
