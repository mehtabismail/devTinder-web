import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { id, type, message, duration = 3000 } = action.payload;
      state.toasts.push({
        id,
        type,
        message,
        duration,
        timestamp: Date.now(),
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;

// Selectors
export const selectToasts = (state) => state.toast.toasts;

// Helper functions for different toast types
export const showSuccessToast = (message, duration) => ({
  type: addToast.type,
  payload: {
    id: Date.now() + Math.random(),
    type: "success",
    message,
    duration,
  },
});

export const showErrorToast = (message, duration) => ({
  type: addToast.type,
  payload: {
    id: Date.now() + Math.random(),
    type: "error",
    message,
    duration,
  },
});

export const showWarningToast = (message, duration) => ({
  type: addToast.type,
  payload: {
    id: Date.now() + Math.random(),
    type: "warning",
    message,
    duration,
  },
});

export const showInfoToast = (message, duration) => ({
  type: addToast.type,
  payload: {
    id: Date.now() + Math.random(),
    type: "info",
    message,
    duration,
  },
});

export default toastSlice.reducer;
