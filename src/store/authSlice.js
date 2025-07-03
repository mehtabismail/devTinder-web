import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage if available
const getInitialState = () => {
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("auth_user");

  return {
    user: user ? JSON.parse(user) : null,
    token: token || null,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      // Store in localStorage
      localStorage.setItem("auth_token", action.payload.token);
      localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;

      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    },

    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    },

    // Update user profile
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("auth_user", JSON.stringify(state.user));
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
  setLoading,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

// Export reducer
export default authSlice.reducer;
