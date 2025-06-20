/**
 * Task Entity Types
 * Core task data structures and related types following FSD entity layer conventions
 */

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  deadline?: string;
  projectId: string;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assignee?: string;
  deadline?: string;
  dependencies: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  projectId?: string;
  assignee?: string;
  deadline?: string;
  dependencies?: string[];
}

export interface TasksResponse {
  data: Task[];
  total: number;
}

export interface TaskResponse {
  data: Task;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

// Filter and query types
export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
}
