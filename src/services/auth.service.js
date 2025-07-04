import { routes } from "../config";
import apiClient from "../lib/api-client";

// Auth service for handling authentication-related API calls
export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await apiClient.post(routes.LOGIN, credentials);
    return response.data;
  },
  // Signup user
  signup: async (userData) => {
    const response = await apiClient.post(routes.SIGNUP, userData);
    return response.data;
  },
  // Logout user
  logout: async () => {
    const response = await apiClient.post(routes.LOGOUT);
    return response.data;
  },
  // Update user profile
  updateProfile: async (userId, data) => {
    const response = await apiClient.patch(`/update/${userId}`, data);
    return response.data;
  },
  // Fetch accepted connections
  getAcceptedConnections: async () => {
    const response = await apiClient.get(routes.ACCEPTED_CONNECTIONS);
    return response.data;
  },
  // Fetch received requests
  getReceivedRequests: async () => {
    const response = await apiClient.get(routes.RECEIVED_REQUESTS);
    return response.data;
  },
  // Review a request (accept or reject)
  reviewRequest: async (status, requestId) => {
    const response = await apiClient.post(
      `/request/review/${status}/${requestId}`
    );
    return response.data;
  },
};
