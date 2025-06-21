/**
 * Task Entity Types
 * Core task data structures and related types following FSD entity layer conventions
 */

import type { User } from '~/entities/user';
import type { Project } from '~/entities/project';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  deadline?: string;
  projectId: string;
  dependencies: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  completedAt?: string;
}

export interface TaskWithRelations extends Task {
  assignee?: User;
  project: Project;
  dependencyTasks: Task[];
  creator: User;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId?: string;
  deadline?: string;
  dependencies: string[];
  estimatedHours?: number;
  tags: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  deadline?: string;
  dependencies?: string[];
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

export interface TasksResponse {
  data: Task[];
  total: number;
}

export interface TaskResponse {
  data: Task;
}

// Filter and query types
export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  createdBy?: string;
  teamId?: string;
  tags?: string[];
  hasDeadline?: boolean;
  isOverdue?: boolean;
}
