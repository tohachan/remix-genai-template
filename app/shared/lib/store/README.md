# RTK Query Store Configuration

This directory contains the Redux store configuration with RTK Query for global state management and API caching.

## Overview

RTK Query is integrated into the project following Feature-Sliced Design principles:
- **Base API configuration** in `shared/lib/store`
- **Feature-specific endpoints** in each feature's `api.ts` file
- **Proper layer separation** maintained through hooks

## Files

- `api.ts` - Base RTK Query API configuration with shared settings
- `index.ts` - Redux store setup with RTK Query middleware
- `README.md` - This documentation

## Usage

### Creating Feature APIs

In feature slices, extend the base API:

```typescript
// app/features/users/api.ts
import { baseApi } from '~/shared/lib/store/api';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
  }),
});
```

### Using in Components

Follow the FSD layer separation pattern:

```typescript
// 1. API Layer (api.ts) - RTK Query endpoints
// 2. Hooks Layer (hooks.ts) - Business logic
// 3. UI Layer (ui/) - Components use hooks, not API directly

// In hooks.ts
export function useUsersList() {
  const { data, isLoading, error } = useGetUsersQuery();
  return { users: data?.data || [], isLoading, error };
}

// In UI component
export function UserList() {
  const { users, isLoading } = useUsersList(); // Use hook, not RTK Query directly
  // ...
}
```

## Configuration

### Base URL
Default base URL is `/api`. Change in `api.ts` if needed.

### Authentication
Headers are automatically added in `prepareHeaders`:
- Authorization token from auth state
- Content-Type: application/json

### Error Handling
- Network errors are handled by base query
- 401 errors trigger token refresh (when implemented)
- Standard error transformation available

### Caching Tags
Predefined cache tags in `api.ts`:
- `User` - User-related data
- `Auth` - Authentication data  
- `Profile` - Profile data
- `Project` - Project management data
- `Task` - Task management data

Add new tags as needed for your features.

## Integration with FSD

### Shared Layer
- Base API configuration
- Common types and utilities
- Redux store setup

### Feature Layer
- Feature-specific API endpoints
- Business logic hooks
- UI components using hooks

### Benefits
- **Consistency** - Standardized API patterns
- **Performance** - Automatic caching and invalidation
- **Developer Experience** - Generated hooks with TypeScript
- **Architecture** - Clean separation of concerns 