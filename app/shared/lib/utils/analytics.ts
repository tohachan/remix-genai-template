import { format, parseISO, differenceInDays, startOfWeek, endOfWeek, subDays, isWithinInterval } from 'date-fns';
import type { Task } from '~/entities/task';
import type { User } from '~/entities/user';

export interface BurndownDataPoint {
  date: string;
  remaining: number;
  ideal: number;
  completed: number;
}

export interface WorkloadDataPoint {
  name: string;
  assigned: number;
  completed: number;
  inProgress: number;
}

export interface CompletionStats {
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  totalTasks: number;
  completionRate: number;
}

export interface TimeRangeFilter {
  label: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Generate time range filters for analytics
 */
export const generateTimeRanges = (): TimeRangeFilter[] => {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  return [
    {
      label: 'This Week',
      startDate: weekStart,
      endDate: weekEnd,
    },
    {
      label: 'Last 7 Days',
      startDate: subDays(now, 7),
      endDate: now,
    },
    {
      label: 'Last 30 Days',
      startDate: subDays(now, 30),
      endDate: now,
    },
    {
      label: 'Last 90 Days',
      startDate: subDays(now, 90),
      endDate: now,
    },
  ];
};

/**
 * Calculate burndown chart data for a set of tasks
 */
export const calculateBurndownData = (
  tasks: Task[],
  startDate: Date,
  endDate: Date,
): BurndownDataPoint[] => {
  const data: BurndownDataPoint[] = [];
  const totalTasks = tasks.length;
  const daysDiff = differenceInDays(endDate, startDate);

  // Generate data points for each day in the range
  for (let i = 0; i <= daysDiff; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // Count tasks completed by this date
    const completedByDate = tasks.filter(task =>
      task.status === 'done' &&
      task.updatedAt &&
      new Date(task.updatedAt) <= currentDate,
    ).length;

    const remaining = totalTasks - completedByDate;
    const ideal = Math.max(0, totalTasks - (totalTasks * i / daysDiff));

    data.push({
      date: format(currentDate, 'MMM dd'),
      remaining,
      ideal: Math.round(ideal),
      completed: completedByDate,
    });
  }

  return data;
};

/**
 * Calculate team workload data
 */
export const calculateTeamWorkload = (
  tasks: Task[],
  teamMembers: User[],
): WorkloadDataPoint[] => {
  return teamMembers.map(member => {
    const memberTasks = tasks.filter(task => task.assigneeId === member.id);

    const assigned = memberTasks.length;
    const completed = memberTasks.filter(task => task.status === 'done').length;
    const inProgress = memberTasks.filter(task => task.status === 'in-progress').length;

    return {
      name: member.name,
      assigned,
      completed,
      inProgress,
    };
  });
};

/**
 * Calculate task completion statistics
 */
export const calculateCompletionStats = (tasks: Task[]): CompletionStats => {
  const now = new Date();

  const completed = tasks.filter(task => task.status === 'done').length;
  const inProgress = tasks.filter(task => task.status === 'in-progress').length;
  const todo = tasks.filter(task => task.status === 'todo').length;

  const overdue = tasks.filter(task =>
    task.deadline &&
    new Date(task.deadline) < now &&
    task.status !== 'done',
  ).length;

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  return {
    completed,
    inProgress,
    todo,
    overdue,
    totalTasks,
    completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
  };
};

/**
 * Filter tasks by date range
 */
export const filterTasksByDateRange = (
  tasks: Task[],
  startDate: Date,
  endDate: Date,
): Task[] => {
  return tasks.filter(task => {
    if (!task.createdAt) return false;

    const taskDate = parseISO(task.createdAt);
    return isWithinInterval(taskDate, { start: startDate, end: endDate });
  });
};

/**
 * Calculate task priority distribution
 */
export const calculatePriorityDistribution = (tasks: Task[]) => {
  const distribution = {
    high: 0,
    medium: 0,
    low: 0,
  };

  tasks.forEach(task => {
    if (task.priority && task.priority in distribution) {
      distribution[task.priority as keyof typeof distribution]++;
    }
  });

  return Object.entries(distribution).map(([priority, count]) => ({
    priority,
    count,
    percentage: tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0,
  }));
};

/**
 * Calculate daily task completion trend
 */
export const calculateCompletionTrend = (
  tasks: Task[],
  days: number = 30,
): Array<{ date: string; completed: number }> => {
  const endDate = new Date();
  const trend: Array<{ date: string; completed: number }> = [];

  for (let i = 0; i < days; i++) {
    const currentDate = subDays(endDate, days - 1 - i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    const completedOnDate = tasks.filter(task =>
      task.status === 'done' &&
      task.updatedAt &&
      format(parseISO(task.updatedAt), 'yyyy-MM-dd') === dateStr,
    ).length;

    trend.push({
      date: format(currentDate, 'MMM dd'),
      completed: completedOnDate,
    });
  }

  return trend;
};
