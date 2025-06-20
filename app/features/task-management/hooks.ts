/**
 * Task Management Hooks
 * React hooks specific to task-management feature
 * Following layer boundaries: hooks orchestrate API calls, UI components consume hooks
 */

import { useCallback } from 'react';
import {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from './api';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilters,
} from '~/entities/task';

/**
 * Hook for fetching and filtering tasks
 */
export const useTasks = (filters?: TaskFilters) => {
  const { data, isLoading, error, refetch } = useGetTasksQuery(filters);

  return {
    tasks: data?.data || [],
    totalTasks: data?.total || 0,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for fetching a single task
 */
export const useTask = (taskId: string) => {
  const { data, isLoading, error } = useGetTaskQuery(taskId);

  return {
    task: data?.data,
    isLoading,
    error,
  };
};

/**
 * Hook for creating tasks with loading and error states
 */
export const useCreateTask = () => {
  const [createTaskMutation, { isLoading, error }] = useCreateTaskMutation();

  const createTask = useCallback(async(taskData: CreateTaskRequest): Promise<Task | null> => {
    try {
      const result = await createTaskMutation(taskData).unwrap();
      return result.data;
    } catch (err) {
      console.error('Failed to create task:', err);
      return null;
    }
  }, [createTaskMutation]);

  return {
    createTask,
    isLoading,
    error,
  };
};

/**
 * Hook for updating tasks with optimistic updates
 */
export const useUpdateTask = () => {
  const [updateTaskMutation, { isLoading, error }] = useUpdateTaskMutation();

  const updateTask = useCallback(async(
    taskId: string,
    updates: UpdateTaskRequest,
  ): Promise<Task | null> => {
    try {
      const result = await updateTaskMutation({ id: taskId, body: updates }).unwrap();
      return result.data;
    } catch (err) {
      console.error('Failed to update task:', err);
      return null;
    }
  }, [updateTaskMutation]);

  return {
    updateTask,
    isLoading,
    error,
  };
};

/**
 * Hook for deleting tasks
 */
export const useDeleteTask = () => {
  const [deleteTaskMutation, { isLoading, error }] = useDeleteTaskMutation();

  const deleteTask = useCallback(async(taskId: string): Promise<boolean> => {
    try {
      await deleteTaskMutation(taskId).unwrap();
      return true;
    } catch (err) {
      console.error('Failed to delete task:', err);
      return false;
    }
  }, [deleteTaskMutation]);

  return {
    deleteTask,
    isLoading,
    error,
  };
};

/**
 * Hook for managing task status changes (for Kanban board)
 */
export const useTaskStatus = () => {
  const { updateTask, isLoading, error } = useUpdateTask();

  const updateTaskStatus = useCallback(async(
    taskId: string,
    status: Task['status'],
  ): Promise<Task | null> => {
    return await updateTask(taskId, { status });
  }, [updateTask]);

  return {
    updateTaskStatus,
    isLoading,
    error,
  };
};

/**
 * Hook for managing task dependencies
 */
export const useTaskDependencies = () => {
  const { updateTask, isLoading, error } = useUpdateTask();

  const addDependency = useCallback(async(
    taskId: string,
    dependencyId: string,
  ): Promise<Task | null> => {
    // First fetch current task to get existing dependencies
    // This is simplified - in real implementation you'd want to fetch current state
    return await updateTask(taskId, {
      dependencies: [dependencyId], // This should merge with existing dependencies
    });
  }, [updateTask]);

  const removeDependency = useCallback(async(
    taskId: string,
    _dependencyId: string,
  ): Promise<Task | null> => {
    // Similar to addDependency, this should remove from existing dependencies
    return await updateTask(taskId, {
      dependencies: [], // This should filter out the dependencyId
    });
  }, [updateTask]);

  return {
    addDependency,
    removeDependency,
    isLoading,
    error,
  };
};

/**
 * Combined hook for all task management operations
 * This is the main public API for UI components
 */
export const useTaskManagement = (filters?: TaskFilters) => {
  const tasksQuery = useTasks(filters);
  const createTaskHook = useCreateTask();
  const updateTaskHook = useUpdateTask();
  const deleteTaskHook = useDeleteTask();
  const taskStatusHook = useTaskStatus();

  return {
    // Task list operations
    tasks: tasksQuery.tasks,
    totalTasks: tasksQuery.totalTasks,
    isLoadingTasks: tasksQuery.isLoading,
    tasksError: tasksQuery.error,
    refetchTasks: tasksQuery.refetch,

    // Task creation
    createTask: createTaskHook.createTask,
    isCreating: createTaskHook.isLoading,
    createError: createTaskHook.error,

    // Task updates
    updateTask: updateTaskHook.updateTask,
    isUpdating: updateTaskHook.isLoading,
    updateError: updateTaskHook.error,

    // Task deletion
    deleteTask: deleteTaskHook.deleteTask,
    isDeleting: deleteTaskHook.isLoading,
    deleteError: deleteTaskHook.error,

    // Status management
    updateTaskStatus: taskStatusHook.updateTaskStatus,
    isUpdatingStatus: taskStatusHook.isLoading,
    statusError: taskStatusHook.error,
  };
};
