# Toast System Documentation

This project now includes a comprehensive toast notification system that allows you to show messages across all screens. The system is built using Redux for state management and DaisyUI for styling.

## Features

- ✅ **Multiple Toast Types**: Success, Error, Warning, Info
- ✅ **Auto-dismiss**: Toasts automatically disappear after a specified duration
- ✅ **Manual Dismiss**: Users can manually close toasts
- ✅ **Global Access**: Use toasts from any component
- ✅ **Customizable Duration**: Set custom display times for each toast
- ✅ **Beautiful UI**: Styled with DaisyUI components
- ✅ **Responsive**: Works on all screen sizes

## Quick Start

### 1. Using the Toast Hook

Import and use the `useToast` hook in any component:

```jsx
import { useToast } from "../hooks/useToast";

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success("Operation completed successfully!");
  };

  const handleError = () => {
    error("Something went wrong!");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### 2. Available Toast Methods

```jsx
const { success, error, warning, info, showToast } = useToast();

// Basic usage (default 5 seconds duration)
success("Success message");
error("Error message");
warning("Warning message");
info("Info message");

// With custom duration (in milliseconds)
success("Success message", 3000); // 3 seconds
error("Error message", 10000); // 10 seconds

// Advanced usage with custom type
showToast("custom", "Custom message", 5000);
```

### 3. Toast Types and Styling

| Type      | Color  | Icon | Use Case                             |
| --------- | ------ | ---- | ------------------------------------ |
| `success` | Green  | ✓    | Successful operations, confirmations |
| `error`   | Red    | ✗    | Errors, failures, exceptions         |
| `warning` | Yellow | ⚠    | Warnings, cautions, confirmations    |
| `info`    | Blue   | ℹ    | Information, tips, updates           |

## Implementation Details

### File Structure

```
src/
├── store/
│   ├── toastSlice.js          # Redux slice for toast state
│   └── store.js               # Updated to include toast reducer
├── components/
│   ├── ToastContainer.jsx     # Main toast display component
│   └── ToastExample.jsx       # Demo component
├── hooks/
│   └── useToast.js            # Custom hook for easy toast usage
└── App.jsx                    # Updated to include ToastContainer
```

### Redux State Structure

```javascript
{
  toast: {
    toasts: [
      {
        id: "unique-id",
        type: "success|error|warning|info",
        message: "Toast message",
        duration: 5000,
        timestamp: 1234567890,
      },
    ];
  }
}
```

## Usage Examples

### 1. Login Success/Error

```jsx
// In Login.jsx
const { success, error } = useToast();

const handleLogin = async () => {
  try {
    const result = await loginAPI(credentials);
    success("Login successful! Welcome back!");
    // Redirect or update state
  } catch (err) {
    error(err.message || "Login failed. Please try again.");
  }
};
```

### 2. Form Validation

```jsx
// In any form component
const { error, success } = useToast();

const handleSubmit = (formData) => {
  if (!formData.email) {
    error("Email is required");
    return;
  }

  if (!formData.password) {
    error("Password is required");
    return;
  }

  // Process form
  success("Form submitted successfully!");
};
```

### 3. API Operations

```jsx
// In any component making API calls
const { success, error, warning } = useToast();

const handleSave = async () => {
  try {
    await saveData(data);
    success("Data saved successfully!");
  } catch (err) {
    if (err.status === 409) {
      warning("This data already exists. Please check your input.");
    } else {
      error("Failed to save data. Please try again.");
    }
  }
};
```

### 4. User Actions

```jsx
// For user interactions
const { success, info } = useToast();

const handleCopy = () => {
  navigator.clipboard.writeText(text);
  success("Copied to clipboard!");
};

const handleShare = () => {
  // Share logic
  info("Link shared successfully!");
};
```

## Customization

### 1. Toast Position

The toasts are positioned in the top-right corner by default. To change this, modify the `ToastContainer.jsx`:

```jsx
// Change from toast-top toast-end to:
<div className="toast toast-bottom toast-start"> // Bottom-left
<div className="toast toast-top toast-start">   // Top-left
<div className="toast toast-bottom toast-end">  // Bottom-right
```

### 2. Toast Styling

Modify the `getToastClass` function in `ToastContainer.jsx` to change colors:

```jsx
const getToastClass = (type) => {
  switch (type) {
    case "success":
      return "alert-success bg-green-500"; // Custom styling
    case "error":
      return "alert-error bg-red-500";
    // ... other cases
  }
};
```

### 3. Default Duration

Change the default duration in `toastSlice.js`:

```jsx
addToast: (state, action) => {
  const { id, type, message, duration = 3000 } = action.payload; // Changed from 5000
  // ...
};
```

## Best Practices

1. **Keep Messages Concise**: Toast messages should be short and clear
2. **Use Appropriate Types**: Match the toast type to the message content
3. **Don't Overuse**: Avoid showing toasts for every minor action
4. **Handle Errors Gracefully**: Always provide meaningful error messages
5. **Consider Duration**: Longer messages might need longer display times

## Troubleshooting

### Toast Not Appearing

- Ensure `ToastContainer` is included in your `App.jsx`
- Check that Redux store includes the toast reducer
- Verify the component is wrapped in Redux Provider

### Multiple Toasts Not Showing

- The system supports multiple toasts simultaneously
- Each toast has a unique ID and will display independently
- Check for any CSS conflicts that might hide toasts

### Styling Issues

- Ensure DaisyUI is properly configured
- Check that Tailwind CSS classes are available
- Verify the toast container has proper z-index

## Migration from Old Error Handling

If you were previously using local state for error messages, replace:

```jsx
// Old way
const [errorMessage, setErrorMessage] = useState("");

// New way
const { error } = useToast();

// Old way
setErrorMessage("Login failed");

// New way
error("Login failed");
```

This provides a consistent, global notification system across your entire application!
