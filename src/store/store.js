import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import toastReducer from "./toastSlice";
import connectionReducer from "./connectionSlice";
import requestsReducer from "./requestsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    connection: connectionReducer,
    request: requestsReducer,
  },
  // Optional: Add middleware for development
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Export types for TypeScript (if needed later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
