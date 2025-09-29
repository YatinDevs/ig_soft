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
    const token = localStorage.getItem("auth-storage");
    if (token) {
      try {
        const authState = JSON.parse(token);
        if (authState.state?.accessToken) {
          config.headers.Authorization = `Bearer ${authState.state.accessToken}`;
        }
      } catch (error) {
        console.error("Error parsing auth state:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await api.post("/refresh");
        const newToken = response.data.access_token;

        // Update stored token
        const authState = JSON.parse(
          localStorage.getItem("auth-storage") || "{}"
        );
        authState.state.accessToken = newToken;
        localStorage.setItem("auth-storage", JSON.stringify(authState));

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("auth-storage");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post("/register", userData),
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

export const publicAPI = {
  getPublicData: () => api.get("/public-data"),
  getSecuredData: () => api.get("/secured-data"),
};

export default api;
