import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { queryKeys } from "../lib/query-keys";

// Hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });

      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // You can add toast notifications here
    },
  });
};
