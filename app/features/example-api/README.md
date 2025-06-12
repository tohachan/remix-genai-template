# For Humans

## Overview
The ExampleApi feature demonstrates RTK Query integration with Feature-Sliced Design architecture. It provides complete CRUD operations for user management using modern state management patterns.

## How to Run
1. Import the feature components:
   ```tsx
   import { UserList, useUsersList } from '~/features/example-api';
   ```

2. Use in your routes or components:
   ```tsx
   <UserList />
   ```

## How to Test
Run tests for this feature:
```bash
npm test -- features/example-api
```

Run all tests:
```bash
npm test
```

## Architecture Pattern

This feature demonstrates proper RTK Query integration with FSD:

### Layer Separation
- **API Layer** (`api.ts`) - RTK Query endpoints and data fetching
- **Hooks Layer** (`hooks.ts`) - Business logic orchestration using RTK Query hooks
- **UI Layer** (`ui/`) - React components consuming business logic hooks

### Key Benefits
- **Automatic caching** - RTK Query handles request deduplication and caching
- **Optimistic updates** - UI updates immediately, syncs with server
- **Error handling** - Standardized error states and retry logic
- **TypeScript integration** - Fully typed API responses and requests

# For AI

<!-- AI_META -->
```json
{
  "purpose": "ExampleApi feature demonstrating RTK Query integration with FSD architecture for user management CRUD operations",
  "publicApi": [
    "UserList - UI component for displaying paginated user list with search and delete",
    "useUsersList - Hook for managing users list with filtering and pagination",
    "useUser - Hook for managing single user data",
    "useCreateUser - Hook for user creation with state management",
    "useUpdateUser - Hook for user updates with optimistic updates",
    "useDeleteUser - Hook for user deletion with confirmation",
    "userApi - RTK Query API slice with all user endpoints",
    "User - User entity type definition",
    "CreateUserRequest - Type for user creation payload",
    "UpdateUserRequest - Type for user update payload"
  ],
  "dependencies": [
    "React",
    "@reduxjs/toolkit",
    "react-redux",
    "~/shared/lib/store",
    "~/shared/lib/rtk-query/types"
  ],
  "tests": {
    "location": "app/features/example-api/**/*.spec.{ts,tsx}",
    "command": "npm test -- features/example-api"
  }
}
```

## Structure
```
app/features/example-api/
├── api.ts               # RTK Query endpoints and user API
├── api.spec.ts          # API tests
├── hooks.ts             # Business logic hooks using RTK Query
├── hooks.spec.ts        # Hook tests
├── ui/                  # UI components
│   └── UserList.tsx     # Main user list component
├── index.ts             # Public exports
└── README.md            # This file
```

## RTK Query Pattern

### API Layer
```typescript
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, QueryParams>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
  }),
});
```

### Hooks Layer
```typescript
export function useUsersList(params: QueryParams = {}) {
  const { data, isLoading, error } = useGetUsersQuery(params);
  return { users: data?.data || [], isLoading, error };
}
```

### UI Layer
```typescript
export default function UserList() {
  const { users, isLoading } = useUsersList(); // Use hook, not RTK Query directly
  // ... component logic
}
```

## Cache Management
- **Tags**: User, Auth, Profile
- **Invalidation**: Automatic cache invalidation on mutations
- **Optimistic updates**: UI updates immediately, rollback on error
- **Refetching**: Automatic refetch on focus/reconnect

## TODO
- Add user creation form component
- Add user edit modal component
- Implement real backend API endpoints
- Add more comprehensive error handling 