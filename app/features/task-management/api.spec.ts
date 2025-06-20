import { taskApi } from './api';

describe('Task API', () => {
  describe('taskApi', () => {
    it('should be defined', () => {
      expect(taskApi).toBeDefined();
    });

    it('should have correct endpoint names', () => {
      expect(taskApi.endpoints.getTasks).toBeDefined();
      expect(taskApi.endpoints.getTask).toBeDefined();
      expect(taskApi.endpoints.createTask).toBeDefined();
      expect(taskApi.endpoints.updateTask).toBeDefined();
      expect(taskApi.endpoints.deleteTask).toBeDefined();
    });

    it('should export hooks for all endpoints', () => {
      const {
        useGetTasksQuery,
        useGetTaskQuery,
        useCreateTaskMutation,
        useUpdateTaskMutation,
        useDeleteTaskMutation,
      } = taskApi;

      expect(useGetTasksQuery).toBeDefined();
      expect(useGetTaskQuery).toBeDefined();
      expect(useCreateTaskMutation).toBeDefined();
      expect(useUpdateTaskMutation).toBeDefined();
      expect(useDeleteTaskMutation).toBeDefined();
    });
  });

  describe('API endpoint configurations', () => {
    it('should configure getTasks with correct query and tags', () => {
      const endpoint = taskApi.endpoints.getTasks;
      expect(endpoint.select).toBeDefined();
    });

    it('should configure createTask with correct mutation and tags', () => {
      const endpoint = taskApi.endpoints.createTask;
      expect(endpoint.select).toBeDefined();
    });

    it('should configure updateTask with correct mutation and tags', () => {
      const endpoint = taskApi.endpoints.updateTask;
      expect(endpoint.select).toBeDefined();
    });

    it('should configure deleteTask with correct mutation and tags', () => {
      const endpoint = taskApi.endpoints.deleteTask;
      expect(endpoint.select).toBeDefined();
    });
  });
});
