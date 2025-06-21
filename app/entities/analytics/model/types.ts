import type { Task } from '~/entities/task';
import type { User } from '~/entities/user';
import type { Team } from '~/entities/team';

/**
 * Analytics data entity
 */
export interface Analytics {
  id: string;
  name: string;
  description?: string;
  type: 'burndown' | 'workload' | 'completion' | 'trend';
  projectId?: string;
  teamId?: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Time range filter options for analytics
 */
export enum TimeRangeFilter {
  THIS_WEEK = 'this_week',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  CUSTOM = 'custom'
}

/**
 * Analytics filters for data queries
 */
export interface AnalyticsFilters {
  timeRange: TimeRangeFilter;
  teamId?: string;
  projectId?: string;
  customDateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Burndown chart data point
 */
export interface BurndownDataPoint {
  date: string;
  ideal: number;
  actual: number;
  remaining: number;
}

/**
 * Team workload data point
 */
export interface TeamWorkloadDataPoint {
  memberName: string;
  memberId: string;
  taskCount: number;
  completedTasks: number;
  pendingTasks: number;
  workload: number; // 0-100 percentage
}

/**
 * Task completion statistics
 */
export interface TaskCompletionStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Analytics summary data
 */
export interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalTeamMembers: number;
  avgTasksPerMember: number;
  completionRate: number;
  burndownProgress: number;
}

/**
 * Analytics API request types
 */
export interface GetAnalyticsRequest {
  filters?: AnalyticsFilters;
  filter?: string;
  page?: number;
  limit?: number;
}

export interface GetAnalyticsByIdRequest {
  id: string;
}

export interface CreateAnalyticsRequest {
  name: string;
  description?: string;
  type: Analytics['type'];
  projectId?: string;
  teamId?: string;
  dateRange: Analytics['dateRange'];
}

export interface UpdateAnalyticsRequest {
  id: string;
  updates: Partial<Omit<Analytics, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface DeleteAnalyticsRequest {
  id: string;
}

/**
 * Analytics API response types
 */
export interface GetAnalyticsResponse {
  analytics: Analytics[];
  items: Analytics[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface GetAnalyticsByIdResponse {
  analytics: Analytics;
  item: Analytics;
}

export interface CreateAnalyticsResponse {
  analytics: Analytics;
  item: Analytics;
  success: boolean;
  message: string;
}

export interface UpdateAnalyticsResponse {
  analytics: Analytics;
  item: Analytics;
  success: boolean;
  message: string;
}

export interface DeleteAnalyticsResponse {
  message: string;
  deletedId: string;
}

export type DeleteAnalyticsApiResponse = void;
