import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global default options for queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (
            error?.response?.status === 408 ||
            error?.response?.status === 429
          ) {
            return failureCount < 3;
          }
          return false;
        }
        // Retry 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnReconnect: true, // Refetch when reconnecting
    },
    mutations: {
      // Global default options for mutations
      retry: false, // Don't retry mutations by default
    },
  },
});

export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
