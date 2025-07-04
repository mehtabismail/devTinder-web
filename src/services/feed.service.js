import { routes } from "../config";
import apiClient from "../lib/api-client";

export const feedService = {
  getFeed: async () => {
    const response = await apiClient.get(routes.FEED);
    return response.data;
  },
  // Send like/dislike (interested/ignored) request
  sendRequest: async (status, toUserId) => {
    const response = await apiClient.post(`request/send/${status}/${toUserId}`);
    return response.data;
  },
};
