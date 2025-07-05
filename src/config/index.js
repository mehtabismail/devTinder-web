export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/";

export const routes = {
  LOGIN: "login",
  REGISTER: "register",
  SIGNUP: "signup",
  PROFILE: "users/profile",
  UPDATE_PROFILE: "users/update-profile",
  LOGOUT: "logout",
  FEED: "feed",
  ACCEPTED_CONNECTIONS: "user/accepted/connections",
  RECEIVED_REQUESTS: "user/requests/received",
};

export const cloudinary = {
  CLOUD_NAME: "mehtab",
};
