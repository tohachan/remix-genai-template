import { baseApi } from '~/shared/lib/store/api';
import type { ApiResponse, PaginatedResponse, QueryParams } from '~/shared/lib/rtk-query/types';

/**
 * Example API endpoints using RTK Query
 * Demonstrates how to create feature-specific API slices
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
}

// Extend the base API with user-specific endpoints
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination
    getUsers: builder.query<User[], QueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append('_page', params.page.toString());
        if (params.limit) searchParams.append('_limit', params.limit.toString());
        if (params.search) searchParams.append('q', params.search);
        if (params.sortBy) searchParams.append('_sort', params.sortBy);
        if (params.sortOrder) searchParams.append('_order', params.sortOrder);
        
        return {
          url: `/users?${searchParams.toString()}`,
        };
      },
      transformResponse: (response: User[], meta, arg) => {
        // json-server returns array directly
        return response || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User', id } as const)),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get single user by ID
    getUser: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiResponse<User>) => response,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Create new user
    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Update existing user
    updateUser: builder.mutation<ApiResponse<User>, UpdateUserRequest>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi; 