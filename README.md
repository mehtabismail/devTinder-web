# DevTinder Web

A modern web application for connecting developers worldwide, built with React, TanStack Query, and DaisyUI.

## Features

- 🔐 Authentication with JWT tokens
- 👥 User profiles and matching
- 💬 Real-time messaging (planned)
- 🎨 Modern UI with DaisyUI
- ⚡ Fast data fetching with TanStack Query
- 🔄 Optimistic updates and caching
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 19, Vite
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS, DaisyUI
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Development**: ESLint, React Query DevTools

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hooks using TanStack Query
├── lib/                # Utility libraries
│   ├── api-client.js   # Axios configuration with interceptors
│   └── query-keys.js   # Centralized query key management
├── pages/              # Page components
│   ├── Login.jsx       # Login page with TanStack Query integration
│   └── Profile.jsx     # User profile page
├── providers/          # Context providers
│   └── QueryProvider.jsx # TanStack Query client provider
├── services/           # API services
│   ├── auth.service.js # Authentication service (currently using mock)
│   └── mock-auth.service.js # Mock service for development
└── App.jsx             # Main app component
```

## TanStack Query Setup

This project uses TanStack Query for efficient data fetching, caching, and state management. Here's how it's configured:

### 1. QueryClient Configuration

The `QueryProvider` component in `src/providers/QueryProvider.jsx` configures the global QueryClient with:

- **Stale Time**: 5 minutes (data considered fresh for 5 minutes)
- **Garbage Collection Time**: 10 minutes (cached data kept for 10 minutes)
- **Retry Logic**: Smart retry strategy (no retry on 4xx errors except 408, 429)
- **Window Focus**: Disabled refetch on window focus
- **Reconnection**: Enabled refetch when reconnecting

### 2. Query Keys Factory

The `src/lib/query-keys.js` file provides a centralized, type-safe way to manage query keys:

```javascript
// Example usage
queryKeys.auth.user(); // ['auth', 'user']
queryKeys.users.detail(123); // ['users', 'detail', 123]
queryKeys.matches.list({ status: "active" }); // ['matches', 'list', { status: 'active' }]
```

### 3. API Client

The `src/lib/api-client.js` configures Axios with:

- **Base URL**: Configurable via environment variables
- **Request Interceptors**: Automatically adds JWT tokens
- **Response Interceptors**: Handles 401/403/500 errors globally
- **Timeout**: 10 seconds

### 4. Custom Hooks

The `src/hooks/useAuth.js` provides reusable hooks for authentication:

```javascript
// Login mutation
const loginMutation = useLogin();
loginMutation.mutate({ email, password });

// Get current user
const { data: user, isLoading, error } = useCurrentUser();

// Update profile
const updateProfileMutation = useUpdateProfile();
updateProfileMutation.mutate(profileData);
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd devTinder-web
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.dev-tinder.com/v1
```

## Development

### Mock Data

The application currently uses mock data for development. You can test the login with:

- **Email**: `developer@example.com`
- **Password**: `password123`

Or:

- **Email**: `designer@example.com`
- **Password**: `password123`

### Switching to Real API

To switch from mock to real API calls:

1. Update `src/services/auth.service.js`:

```javascript
// Comment out the mock service
// export const authService = mockAuthService;

// Uncomment and use the real API service
export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },
  // ... other methods
};
```

2. Uncomment the apiClient import in the same file.

### Adding New API Endpoints

1. **Create a service** in `src/services/`:

```javascript
// src/services/users.service.js
import apiClient from "../lib/api-client";

export const usersService = {
  getUsers: async (filters) => {
    const response = await apiClient.get("/users", { params: filters });
    return response.data;
  },

  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};
```

2. **Add query keys** in `src/lib/query-keys.js`:

```javascript
users: {
  all: ['users'],
  lists: () => [...queryKeys.users.all, 'list'],
  list: (filters) => [...queryKeys.users.lists(), { filters }],
  details: () => [...queryKeys.users.all, 'detail'],
  detail: (userId) => [...queryKeys.users.details(), userId],
},
```

3. **Create custom hooks** in `src/hooks/`:

```javascript
// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/users.service";
import { queryKeys } from "../lib/query-keys";

export const useUsers = (filters) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersService.getUsers(filters),
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getUser(id),
    enabled: !!id,
  });
};
```
## Deployment

- After login into ec2 instance install node init
- Clone your project from github
- cd <your_project> & install dependencies
- npm run build Build your project for production
- sudo apt update
- sudo systemctl install nginx
- sudo systemctl enable nginx
- sudo scp -r dist/* /var/www/html/ copy from dist folder to /var/www/html/
- Enable port 80 of your instance from security tab of your instance by adding new inbound rule for port 80 in security groups

## Best Practices

### 1. Query Keys

- Always use the query keys factory for consistency
- Include all dependencies in the query key
- Use descriptive names for better debugging

### 2. Error Handling

- Handle errors in mutation callbacks
- Use the global error interceptor for common errors
- Provide user-friendly error messages

### 3. Optimistic Updates

- Use `setQueryData` for immediate UI updates
- Invalidate queries after mutations
- Handle rollback on error

### 4. Performance

- Set appropriate `staleTime` and `gcTime`
- Use `enabled` option to control when queries run
- Implement pagination for large datasets

### 5. Caching Strategy

- Cache user data for longer periods
- Cache static data (settings, preferences)
- Invalidate related queries when data changes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
