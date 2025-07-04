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

// Hook for user signup
export const useSignup = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      // If signup includes automatic login, handle it like login
      if (data.user) {
        dispatch(loginSuccess(data));
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
        queryClient.setQueryData(queryKeys.auth.user(), data.user);
      }
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });
};

// Hook for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ userId, data }) => authService.updateProfile(userId, data),
    onSuccess: (updatedUser) => {
      // Update Redux store
      dispatch({ type: "auth/updateUser", payload: updatedUser });
      // Invalidate and refetch user data in React Query
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      queryClient.setQueryData(queryKeys.auth.user(), updatedUser);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
};
