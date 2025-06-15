import { useCallback } from 'react';
import {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  type CreateUserRequest,
  type UpdateUserRequest,
} from './api';
import type { QueryParams } from '~/shared/lib/rtk-query/types';

/**
 * Example hooks that orchestrate RTK Query API calls
 * Demonstrates proper separation between API layer and business logic
 */

// Hook for managing users list with filtering and pagination
export function useUsersList(params: QueryParams = {}) {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery(params);

  return {
    users: users || [],
    isLoading,
    isError,
    error,
    refetch,
    // Computed states for UI
    isEmpty: !isLoading && (!users || users.length === 0),
    hasUsers: !isLoading && users && users.length > 0,
  };
}

// Hook for managing single user data
export function useUser(userId: string) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserQuery(userId, {
    skip: !userId, // Skip query if no userId provided
  });

  return {
    user,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Hook for user creation with state management
export function useCreateUser() {
  const [createUser, { isLoading, isError, error, isSuccess }] =
    useCreateUserMutation();

  const handleCreateUser = useCallback(
    async(userData: CreateUserRequest) => {
      try {
        const result = await createUser(userData).unwrap();
        return result;
      } catch (err) {
        throw err;
      }
    },
    [createUser],
  );

  return {
    createUser: handleCreateUser,
    isLoading,
    isError,
    error,
    isSuccess,
  };
}

// Hook for user updates with optimistic updates
export function useUpdateUser() {
  const [updateUser, { isLoading, isError, error, isSuccess }] =
    useUpdateUserMutation();

  const handleUpdateUser = useCallback(
    async(userData: UpdateUserRequest) => {
      try {
        const result = await updateUser(userData).unwrap();
        return result;
      } catch (err) {
        throw err;
      }
    },
    [updateUser],
  );

  return {
    updateUser: handleUpdateUser,
    isLoading,
    isError,
    error,
    isSuccess,
  };
}

// Hook for user deletion with confirmation
export function useDeleteUser() {
  const [deleteUser, { isLoading, isError, error, isSuccess }] =
    useDeleteUserMutation();

  const handleDeleteUser = useCallback(
    async(userId: string) => {
      try {
        await deleteUser(userId).unwrap();
        return true;
      } catch (err) {
        throw err;
      }
    },
    [deleteUser],
  );

  return {
    deleteUser: handleDeleteUser,
    isLoading,
    isError,
    error,
    isSuccess,
  };
}
