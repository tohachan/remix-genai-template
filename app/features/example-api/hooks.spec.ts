import { useUsersList, useUser, useCreateUser, useUpdateUser, useDeleteUser } from './hooks';

describe('RTK Query Hooks', () => {
  describe('useUsersList', () => {
    it('should be defined', () => {
      expect(useUsersList).toBeDefined();
      expect(typeof useUsersList).toBe('function');
    });
  });

  describe('useUser', () => {
    it('should be defined', () => {
      expect(useUser).toBeDefined();
      expect(typeof useUser).toBe('function');
    });
  });

  describe('useCreateUser', () => {
    it('should be defined', () => {
      expect(useCreateUser).toBeDefined();
      expect(typeof useCreateUser).toBe('function');
    });
  });

  describe('useUpdateUser', () => {
    it('should be defined', () => {
      expect(useUpdateUser).toBeDefined();
      expect(typeof useUpdateUser).toBe('function');
    });
  });

  describe('useDeleteUser', () => {
    it('should be defined', () => {
      expect(useDeleteUser).toBeDefined();
      expect(typeof useDeleteUser).toBe('function');
    });
  });
}); 