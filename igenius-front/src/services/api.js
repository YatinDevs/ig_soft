import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token directly from localStorage to avoid sync issues
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const authState = JSON.parse(authStorage);
        const token = authState.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing auth state:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, and not a login/refresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await api.post("/refresh");
        const newToken = response.data.access_token;

        // Update stored token in localStorage
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const authState = JSON.parse(authStorage);
          authState.state.accessToken = newToken;
          localStorage.setItem("auth-storage", JSON.stringify(authState));
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed, logging out:", refreshError);
        // Clear auth state and redirect to login
        localStorage.removeItem("auth-storage");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    // If it's a 401 on login/refresh, or already retried, just reject
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getUser: () => api.get("/user"),
  refresh: () => api.post("/refresh"),
};

export const profileAPI = {
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),
};

export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getStats: () => api.get("/admin/stats"),
  createUser: (userData) => api.post("/admin/users", userData),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};
// services/api.js - Add levelAPI
export const levelAPI = {
  getLevels: () => api.get("/levels"),
  getLevel: (levelId) => api.get(`/levels/${levelId}`),
  getWeeks: (levelId) => api.get(`/levels/${levelId}/weeks`),
  getQuestionSets: (levelId, weekId) =>
    api.get(`/levels/${levelId}/weeks/${weekId}/question-sets`),
};
export default api;
