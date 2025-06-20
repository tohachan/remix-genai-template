/**
 * Task Management Feature Public API
 * Exports all public interfaces from the task management feature
 */

// UI Components
export { default as TaskList } from './ui/TaskList';
export { default as TaskForm } from './ui/TaskForm';
export { default as TaskCard } from './ui/TaskCard';

// Hooks - Public API for UI components
export {
  useTaskManagement,
  useTasks,
  useTask,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useTaskStatus,
  useTaskDependencies,
} from './hooks';

// API Hooks - Export for direct use if needed
export {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  taskApi,
} from './api';

// Re-export task entity types for convenience
export type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
  TaskResponse,
  TaskStatus,
  TaskPriority,
  TaskFilters,
} from '~/entities/task';
