/**
 * Kanban Board API
 * Backend interactions for kanban board functionality
 * This feature primarily reuses task management API with specific kanban needs
 */

import type {
  Task,
  TaskStatus,
  TaskFilters,
  TaskResponse,
} from '~/entities/task';

// API Contract Definitions (Required by enforce-contracts rule)
// These interfaces define the request/response contracts for kanban board API endpoints

/**
 * Request contract for organizing tasks by status columns
 */
export interface KanbanBoardRequest extends TaskFilters {
  projectId?: string;
}

/**
 * Response contract for kanban board data
 */
export interface KanbanBoardResponse {
  tasksByStatus: {
    todo: Task[];
    'in-progress': Task[];
    done: Task[];
  };
  totalTasks: number;
}

/**
 * Request contract for updating task status via drag-and-drop
 */
export interface KanbanStatusUpdateRequest {
  taskId: string;
  newStatus: TaskStatus;
  position?: number; // For future ordering implementation
}

/**
 * Response contract for status update operations
 */
export type KanbanStatusUpdateResponse = TaskResponse;

/**
 * Request contract for kanban board filtering
 */
export interface KanbanFilterRequest extends TaskFilters {
  searchTerm?: string;
  priorities?: Task['priority'][];
}

/**
 * Response contract for filtered kanban data
 */
export type KanbanFilterResponse = KanbanBoardResponse;

// Re-export task management API endpoints for kanban board use
export {
  useGetTasksQuery,
  useUpdateTaskMutation,
  type GetTasksRequest,
  type GetTasksApiResponse,
  type UpdateTaskApiRequest,
  type UpdateTaskApiResponse,
} from '../task-management/api';

// Future: Add kanban-specific API endpoints here if needed
// For example: board layout persistence, column customization, etc.
