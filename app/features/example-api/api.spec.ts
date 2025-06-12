import { userApi } from './api';

describe('User API', () => {
  describe('userApi', () => {
    it('should be defined', () => {
      expect(userApi).toBeDefined();
    });

    it('should have correct endpoint names', () => {
      expect(userApi.endpoints.getUsers).toBeDefined();
      expect(userApi.endpoints.getUser).toBeDefined();
      expect(userApi.endpoints.createUser).toBeDefined();
      expect(userApi.endpoints.updateUser).toBeDefined();
      expect(userApi.endpoints.deleteUser).toBeDefined();
    });

    it('should export hooks for all endpoints', () => {
      const { 
        useGetUsersQuery,
        useGetUserQuery,
        useCreateUserMutation,
        useUpdateUserMutation,
        useDeleteUserMutation 
      } = userApi;

      expect(useGetUsersQuery).toBeDefined();
      expect(useGetUserQuery).toBeDefined();
      expect(useCreateUserMutation).toBeDefined();
      expect(useUpdateUserMutation).toBeDefined();
      expect(useDeleteUserMutation).toBeDefined();
    });
  });
}); 