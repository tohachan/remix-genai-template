// Jest is configured globally, no imports needed for describe, it, expect
import { renderHook } from '@testing-library/react';
import {
  useTaskManagement,
  useTasks,
  useTask,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useTaskStatus,
  useTaskDependencies,
} from './hooks';

// Mock the API hooks
jest.mock('./api', () => ({
  useGetTasksQuery: jest.fn(() => ({
    data: { data: [], total: 0 },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useGetTaskQuery: jest.fn(() => ({
    data: { data: null },
    isLoading: false,
    error: null,
  })),
  useCreateTaskMutation: jest.fn(() => [
    jest.fn(() => ({ unwrap: jest.fn() })),
    { isLoading: false, error: null },
  ]),
  useUpdateTaskMutation: jest.fn(() => [
    jest.fn(() => ({ unwrap: jest.fn() })),
    { isLoading: false, error: null },
  ]),
  useDeleteTaskMutation: jest.fn(() => [
    jest.fn(() => ({ unwrap: jest.fn() })),
    { isLoading: false, error: null },
  ]),
}));

describe('Task Management Hooks', () => {
  describe('useTasks', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useTasks());
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useTasks());
      expect(result.current).toHaveProperty('tasks');
      expect(result.current).toHaveProperty('totalTasks');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
    });
  });

  describe('useTask', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useTask('1'));
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useTask('1'));
      expect(result.current).toHaveProperty('task');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
    });
  });

  describe('useCreateTask', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useCreateTask());
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useCreateTask());
      expect(result.current).toHaveProperty('createTask');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(typeof result.current.createTask).toBe('function');
    });
  });

  describe('useUpdateTask', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useUpdateTask());
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useUpdateTask());
      expect(result.current).toHaveProperty('updateTask');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(typeof result.current.updateTask).toBe('function');
    });
  });

  describe('useDeleteTask', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useDeleteTask());
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useDeleteTask());
      expect(result.current).toHaveProperty('deleteTask');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(typeof result.current.deleteTask).toBe('function');
    });
  });

  describe('useTaskStatus', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useTaskStatus());
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useTaskStatus());
      expect(result.current).toHaveProperty('updateTaskStatus');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(typeof result.current.updateTaskStatus).toBe('function');
    });
  });

  describe('useTaskDependencies', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useTaskDependencies());
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useTaskDependencies());
      expect(result.current).toHaveProperty('addDependency');
      expect(result.current).toHaveProperty('removeDependency');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(typeof result.current.addDependency).toBe('function');
      expect(typeof result.current.removeDependency).toBe('function');
    });
  });

  describe('useTaskManagement', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useTaskManagement());
      expect(result.current).toBeDefined();
    });

    it('should return expected structure', () => {
      const { result } = renderHook(() => useTaskManagement());

      // Task list operations
      expect(result.current).toHaveProperty('tasks');
      expect(result.current).toHaveProperty('totalTasks');
      expect(result.current).toHaveProperty('isLoadingTasks');
      expect(result.current).toHaveProperty('tasksError');
      expect(result.current).toHaveProperty('refetchTasks');

      // Task creation
      expect(result.current).toHaveProperty('createTask');
      expect(result.current).toHaveProperty('isCreating');
      expect(result.current).toHaveProperty('createError');

      // Task updates
      expect(result.current).toHaveProperty('updateTask');
      expect(result.current).toHaveProperty('isUpdating');
      expect(result.current).toHaveProperty('updateError');

      // Task deletion
      expect(result.current).toHaveProperty('deleteTask');
      expect(result.current).toHaveProperty('isDeleting');
      expect(result.current).toHaveProperty('deleteError');

      // Status management
      expect(result.current).toHaveProperty('updateTaskStatus');
      expect(result.current).toHaveProperty('isUpdatingStatus');
      expect(result.current).toHaveProperty('statusError');
    });

    it('should return functions for all CRUD operations', () => {
      const { result } = renderHook(() => useTaskManagement());
      expect(typeof result.current.createTask).toBe('function');
      expect(typeof result.current.updateTask).toBe('function');
      expect(typeof result.current.deleteTask).toBe('function');
      expect(typeof result.current.updateTaskStatus).toBe('function');
    });
  });
});
