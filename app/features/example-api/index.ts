// UI Components
export { default as UserList } from './ui/UserList';

// Hooks
export {
  useUsersList,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from './hooks';

// API
export {
  userApi,
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from './api';

// Types
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from './api'; 