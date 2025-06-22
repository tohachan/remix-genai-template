# API Contracts Guide

This guide explains how to avoid `enforce-contracts` ESLint errors when creating API files in FSD feature slices.

## 🚨 **Critical: Always Include Local API Contracts**

### **Why the Error Occurs**

The `enforce-contracts` ESLint rule requires **local contract definitions** in API files, even when importing types from entities. Simply importing entity types is not sufficient.

### **❌ This Triggers ESLint Error:**
```typescript
// features/user-management/api.ts
import { baseApi } from '~/shared/lib/store/api';
import type { User, CreateUserData } from '~/entities/user';

// ❌ MISSING: Local API contracts
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<User, CreateUserData>({
      // ESLint ERROR: enforce-contracts violation
    }),
  }),
});
```

### **✅ This Passes ESLint:**
```typescript
// features/user-management/api.ts
import { baseApi } from '~/shared/lib/store/api';
import type { User, CreateUserData } from '~/entities/user';

// ✅ REQUIRED: Local API contracts
export interface CreateUserApiRequest extends CreateUserData {
  // API-specific request structure
}

export interface CreateUserApiResponse {
  user: User;
  success: boolean;
  message?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<CreateUserApiResponse, CreateUserApiRequest>({
      // ✅ Uses explicit API contracts
    }),
  }),
});
```

## 🎯 **Solution Strategies**

### **Strategy 1: Use Auto-Generator (Recommended)**

The updated component generator automatically creates API contracts:

```bash
# This creates API files with proper contracts
npm run generate:component -- UserManagement --layer features --slice user-management --includeTests true --includeStorybook false
```

Generated API file will include all required contracts automatically.

### **Strategy 2: Manual Contract Creation**

When creating API files manually, always include contract definitions:

```typescript
// API Contract Definitions (Required by enforce-contracts rule)

// Request contracts
export interface GetItemsRequest {
  filter?: string;
  page?: number;
  limit?: number;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
}

export interface UpdateItemRequest {
  id: string;
  name?: string;
  description?: string;
}

// Response contracts  
export interface GetItemsResponse {
  items: Item[];
  total: number;
  page: number;
}

export interface CreateItemResponse {
  item: Item;
  success: boolean;
}

export interface UpdateItemResponse {
  item: Item;
  success: boolean;
}

export type DeleteItemResponse = void;
```

### **Strategy 3: Type Aliases (Alternative)**

You can use type aliases when extending entity types:

```typescript
import type { Task, CreateTaskData, TaskResponse } from '~/entities/task';

// API contracts using type aliases
export type CreateTaskApiRequest = CreateTaskData;
export type CreateTaskApiResponse = TaskResponse;
export type GetTasksRequest = TaskFilters | void;
export type GetTasksApiResponse = TasksResponse;
```

## 🏗️ **Integration with FSD Architecture**

### **Recommended File Structure:**

```typescript
// features/user-management/api.ts

// 1. Dependencies
import { baseApi } from '~/shared/lib/store/api';
import type { User, CreateUserData } from '~/entities/user';

// 2. API Contract Definitions (ALWAYS REQUIRED)
export interface GetUsersRequest {
  filter?: string;
  page?: number;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
}

export type CreateUserApiRequest = CreateUserData;

export interface CreateUserApiResponse {
  user: User;
  success: boolean;
}

// 3. RTK Query Implementation
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersRequest>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.filter) searchParams.set('filter', params.filter);
        if (params.page) searchParams.set('page', params.page.toString());
        return `/users?${searchParams.toString()}`;
      },
      providesTags: ['User'],
    }),
    
    createUser: builder.mutation<CreateUserApiResponse, CreateUserApiRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// 4. Export generated hooks
export const {
  useGetUsersQuery,
  useCreateUserMutation,
} = userApi;
```

## 📋 **Quick Checklist**

Before committing API files, ensure:

- [ ] **Local API contracts are defined** in the API file
- [ ] **All RTK Query endpoints use the local contracts** as type parameters
- [ ] **API contracts follow naming convention**: `GetXRequest`, `CreateXResponse`, etc.
- [ ] **Entity imports are supplemented** with local contracts (don't rely on entities alone)
- [ ] **Contracts are exported** for potential reuse in other parts of the feature

## 🛠️ **Troubleshooting**

### **Common Error Messages:**

1. **"API file must contain TypeScript interfaces or schema imports"**
   - **Solution:** Add local interface definitions or type aliases

2. **"Entity imports detected but no local API contracts found"**
   - **Solution:** Add explicit API contracts that extend or use entity types

3. **"Missing API contracts for endpoints"**
   - **Solution:** Ensure every RTK Query endpoint uses typed contracts

### **Quick Fix Template:**

When you get an enforce-contracts error, add this template to your API file:

```typescript
// API Contract Definitions (Required by enforce-contracts rule)

export interface Get[Entity]Request {
  // Define query parameters
}

export interface Get[Entity]Response {
  // Define response structure  
}

export interface Create[Entity]Request {
  // Define creation payload
}

export interface Create[Entity]Response {
  // Define creation response
}

export interface Update[Entity]Request {
  id: string;
  // Define update payload
}

export interface Update[Entity]Response {
  // Define update response
}

export interface Delete[Entity]Request {
  id: string;
}

export type Delete[Entity]Response = void;
```

Replace `[Entity]` with your actual entity name (e.g., `User`, `Task`, `Project`).

## 🎓 **Best Practices**

1. **Always use the generator** when possible - it creates compliant API files automatically
2. **Document your contracts** with JSDoc comments for better developer experience
3. **Keep API contracts simple** and focused on the specific endpoint requirements
4. **Extend entity types** when appropriate, but always create local contracts
5. **Follow consistent naming** patterns: `GetXRequest`, `CreateXResponse`, etc.

## 🔗 **Related Rules**

This guide helps with compliance for:
- `enforce-contracts` - Main rule requiring API contracts
- `feature-slice-baseline` - Ensures complete feature structure
- `enforce-layer-boundaries` - Proper import patterns between layers

By following this guide, you'll avoid `enforce-contracts` errors and maintain clean, well-documented API layers in your FSD architecture. 