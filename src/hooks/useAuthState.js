import { useSelector, useDispatch } from "react-redux";
import {
  selectAuth,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  logout,
  updateUser,
  clearError,
} from "../store/authSlice";

// Hook to access auth state
export const useAuthState = () => {
  const dispatch = useDispatch();

  return {
    // State selectors
    auth: useSelector(selectAuth),
    user: useSelector(selectUser),
    token: useSelector(selectToken),
    isAuthenticated: useSelector(selectIsAuthenticated),
    isLoading: useSelector(selectIsLoading),
    error: useSelector(selectError),

    // Actions
    logout: () => dispatch(logout()),
    updateUser: (userData) => dispatch(updateUser(userData)),
    clearError: () => dispatch(clearError()),
  };
};
