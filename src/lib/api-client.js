import axios from "axios";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      // Redirect to login or trigger auth refresh
      window.location.href = "/login";
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
