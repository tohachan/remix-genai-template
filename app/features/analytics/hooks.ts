/**
 * Analytics Feature Hooks
 * React hooks specific to analytics feature
 */

import { useMemo, useState } from 'react';
import {
  TimeRangeFilter,
  type AnalyticsFilters,
  type BurndownDataPoint,
  type TeamWorkloadDataPoint,
  type TaskCompletionStats,
  type AnalyticsSummary,
} from '~/entities/analytics';

/**
 * Main analytics hook that provides filtered and processed analytics data
 */
export const useAnalyticsData = (initialFilters?: Partial<AnalyticsFilters>) => {
  const [filters, setFilters] = useState<AnalyticsFilters>(() => {
    const baseFilters: AnalyticsFilters = {
      timeRange: initialFilters?.timeRange || TimeRangeFilter.LAST_30_DAYS,
    };

    if (initialFilters?.teamId) {
      baseFilters.teamId = initialFilters.teamId;
    }

    if (initialFilters?.projectId) {
      baseFilters.projectId = initialFilters.projectId;
    }

    if (initialFilters?.customDateRange) {
      baseFilters.customDateRange = initialFilters.customDateRange;
    }

    return baseFilters;
  });

  // For now, return mock data to fix TypeScript errors
  // TODO: Connect to real APIs when ready
  const mockTasks: any[] = [];
  const mockTeams: any[] = [];
  const mockTeamMembers: any[] = [];

  return {
    tasks: mockTasks,
    teams: mockTeams,
    teamMembers: mockTeamMembers,
    filters,
    setFilters,
    isLoading: false,
    error: null,
  };
};

/**
 * Hook for burndown chart data processing
 */
export const useBurndownData = (filters?: AnalyticsFilters): BurndownDataPoint[] => {
  const { tasks } = useAnalyticsData(filters);

  return useMemo(() => {
    // Return mock burndown data for now
    return [
      { date: '2024-01-01', ideal: 100, actual: 100, remaining: 100 },
      { date: '2024-01-15', ideal: 50, actual: 60, remaining: 40 },
      { date: '2024-01-30', ideal: 0, actual: 10, remaining: 0 },
    ];
  }, [tasks]);
};

/**
 * Hook for team workload data processing
 */
export const useWorkloadData = (filters?: AnalyticsFilters): TeamWorkloadDataPoint[] => {
  const { teamMembers } = useAnalyticsData(filters);

  return useMemo(() => {
    // Return mock workload data for now
    return [
      {
        memberName: 'John Doe',
        memberId: '1',
        taskCount: 10,
        completedTasks: 7,
        pendingTasks: 3,
        workload: 70,
      },
      {
        memberName: 'Jane Smith',
        memberId: '2',
        taskCount: 8,
        completedTasks: 6,
        pendingTasks: 2,
        workload: 75,
      },
    ];
  }, [teamMembers]);
};

/**
 * Hook for task completion statistics
 */
export const useCompletionStats = (filters?: AnalyticsFilters): TaskCompletionStats => {
  const { tasks } = useAnalyticsData(filters);

  return useMemo(() => {
    // Return mock completion stats for now
    return {
      total: 20,
      completed: 14,
      pending: 6,
      overdue: 2,
      completionRate: 70,
      priorityDistribution: {
        high: 5,
        medium: 10,
        low: 5,
      },
    };
  }, [tasks]);
};

/**
 * Hook for priority distribution data
 */
export const usePriorityDistribution = (filters?: AnalyticsFilters) => {
  const { tasks } = useAnalyticsData(filters);

  return useMemo(() => {
    // Return mock priority distribution for now
    return [
      { priority: 'high', count: 5, percentage: 25 },
      { priority: 'medium', count: 10, percentage: 50 },
      { priority: 'low', count: 5, percentage: 25 },
    ];
  }, [tasks]);
};

/**
 * Hook for completion trend data
 */
export const useCompletionTrend = (filters?: AnalyticsFilters, days: number = 30) => {
  const { tasks } = useAnalyticsData(filters);

  return useMemo(() => {
    // Return mock completion trend for now
    return [
      { date: '2024-01-01', completed: 2 },
      { date: '2024-01-02', completed: 3 },
      { date: '2024-01-03', completed: 1 },
      { date: '2024-01-04', completed: 4 },
      { date: '2024-01-05', completed: 2 },
    ];
  }, [tasks, days]);
};

/**
 * Hook for analytics summary/overview
 */
export const useAnalyticsSummary = (filters?: AnalyticsFilters): AnalyticsSummary => {
  const { tasks, teamMembers } = useAnalyticsData(filters);

  return useMemo(() => {
    // Return mock analytics summary for now
    return {
      totalTasks: 20,
      completedTasks: 14,
      pendingTasks: 6,
      overdueTasks: 2,
      totalTeamMembers: 5,
      avgTasksPerMember: 4,
      completionRate: 70,
      burndownProgress: 75,
    };
  }, [tasks, teamMembers]);
};
