import React from "react";
import { useToast } from "../hooks/useToast";

const ToastExample = () => {
  const { success, error, warning, info } = useToast();

  const handleShowToasts = () => {
    // Show different types of toasts
    success("This is a success message!", 3000);

    setTimeout(() => {
      error("This is an error message!", 4000);
    }, 500);

    setTimeout(() => {
      warning("This is a warning message!", 3500);
    }, 1000);

    setTimeout(() => {
      info("This is an info message!", 3000);
    }, 1500);
  };

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Toast System Demo</h2>
      <div className='space-y-2'>
        <button
          className='btn btn-success'
          onClick={() => success("Success toast!")}
        >
          Show Success Toast
        </button>
        <button className='btn btn-error' onClick={() => error("Error toast!")}>
          Show Error Toast
        </button>
        <button
          className='btn btn-warning'
          onClick={() => warning("Warning toast!")}
        >
          Show Warning Toast
        </button>
        <button className='btn btn-info' onClick={() => info("Info toast!")}>
          Show Info Toast
        </button>
        <button className='btn btn-primary' onClick={handleShowToasts}>
          Show All Toasts
        </button>
      </div>
    </div>
  );
};

export default ToastExample;
