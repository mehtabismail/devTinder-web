import { useDispatch } from "react-redux";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  addToast,
} from "../store/toastSlice";

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (type, message, duration = 5000) => {
    const toastAction = {
      type: addToast.type,
      payload: {
        id: Date.now() + Math.random(),
        type,
        message,
        duration,
      },
    };
    dispatch(toastAction);
  };

  const success = (message, duration) => {
    dispatch(showSuccessToast(message, duration));
  };

  const error = (message, duration) => {
    dispatch(showErrorToast(message, duration));
  };

  const warning = (message, duration) => {
    dispatch(showWarningToast(message, duration));
  };

  const info = (message, duration) => {
    dispatch(showInfoToast(message, duration));
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
};
