import apiClient from "../lib/api-client";

// Auth service for handling authentication-related API calls
export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  },
};
