import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { authService } from "../services/auth.service";
import { queryKeys } from "../lib/query-keys";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";

// Hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      // Dispatch loading state
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      // Dispatch success action to Redux
      dispatch(loginSuccess(data));

      // Invalidate and refetch user data in React Query
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });

      // Set user data in React Query cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
    onError: (error) => {
      // Dispatch error action to Redux
      const errorMessage =
        error?.response?.data?.message || error?.message || "Login failed";
      dispatch(loginFailure(errorMessage));

      console.error("Login failed:", error);
    },
  });
};
