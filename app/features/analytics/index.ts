/**
 * Analytics Feature Exports
 * Public API for the analytics feature following FSD conventions
 */

// Main analytics dashboard
export { default as AnalyticsPage } from './ui/analytics.page';

// Individual chart components
export { default as BurndownChart } from './ui/BurndownChart';
export { default as TeamWorkloadChart } from './ui/TeamWorkloadChart';
export { default as TaskCompletionReport } from './ui/TaskCompletionReport';

// Analytics hooks and utilities
export {
  useAnalyticsData,
  useBurndownData,
  useWorkloadData,
  useCompletionStats,
  usePriorityDistribution,
  useCompletionTrend,
  useAnalyticsSummary,

} from './hooks';

// Analytics API endpoints
export {
  analyticsApi,
} from './api';
