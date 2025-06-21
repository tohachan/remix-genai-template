/**
 * Project Entity Types
 * Defines project-related data structures and types for project management functionality
 */

import type { User } from '~/entities/user';
import type { Team } from '~/entities/team';

export type ProjectStatus = 'active' | 'completed' | 'paused' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate?: string;
  deadline?: string;
  progress: number; // 0-100
  budget?: number;
  teamId?: string;
  ownerId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  tags: string[];
  color?: string;
}

export interface ProjectWithRelations extends Project {
  owner: User;
  team?: Team;
  taskCount: number;
  completedTaskCount: number;
  memberCount: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
  priority: ProjectPriority;
  startDate: string;
  endDate?: string;
  deadline?: string;
  budget?: number;
  teamId?: string;
  tags: string[];
  color?: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  progress?: number;
  budget?: number;
  teamId?: string;
  isArchived?: boolean;
  tags?: string[];
  color?: string;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageTaskCompletion: number;
}

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  teamId?: string;
  ownerId?: string;
  tags?: string[];
  isArchived?: boolean;
}

export interface ProjectResponse {
  data: Project;
}

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}
