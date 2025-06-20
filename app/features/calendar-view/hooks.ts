/**
 * Calendar View Hooks
 * React hooks specific to calendar-view feature
 * Following layer boundaries: hooks use task-management hooks, UI components consume these hooks
 */

import { useCallback, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { useTasks, useUpdateTask } from '~/features/task-management/hooks';
import type { Task } from '~/entities/task';

// Calendar event interface for react-big-calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

/**
 * Hook for getting calendar events from tasks
 */
export const useCalendarEvents = (projectId?: string) => {
  const filters = projectId ? { projectId } : undefined;
  const { tasks, isLoading, error, refetch } = useTasks(filters);

  // Transform tasks with deadlines into calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return tasks
      .filter(task => task.deadline) // Only include tasks with deadlines
      .map(task => {
        const deadline = parseISO(task.deadline as string);
        return {
          id: task.id,
          title: task.title,
          start: deadline,
          end: deadline, // For now, tasks are all-day events
          resource: task,
        };
      });
  }, [tasks]);

  return {
    events,
    tasks,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for handling task drag-and-drop to update deadlines
 */
export const useTaskDragDrop = () => {
  const { updateTask, isLoading, error } = useUpdateTask();

  const handleEventDrop = useCallback(async(
    eventId: string,
    newDate: Date,
  ): Promise<boolean> => {
    try {
      const newDeadline = format(newDate, 'yyyy-MM-dd');
      const result = await updateTask(eventId, { deadline: newDeadline });
      return result !== null;
    } catch (err) {
      console.error('Failed to update task deadline:', err);
      return false;
    }
  }, [updateTask]);

  return {
    handleEventDrop,
    isUpdating: isLoading,
    error,
  };
};

/**
 * Hook for calendar filtering and view management
 */
export const useCalendarFilters = () => {
  const handleDateRangeChange = useCallback((range: Date[] | { start: Date; end: Date }) => {
    // Could be used to filter tasks by date range in the future
    console.log('Date range changed:', range);
  }, []);

  const handleViewChange = useCallback((view: string) => {
    // Could be used to adjust calendar view preferences
    console.log('View changed:', view);
  }, []);

  return {
    handleDateRangeChange,
    handleViewChange,
  };
};

/**
 * Combined hook for all calendar operations
 * This is the main public API for calendar UI components
 */
export const useCalendar = (projectId?: string) => {
  const eventsQuery = useCalendarEvents(projectId);
  const dragDropHook = useTaskDragDrop();
  const filtersHook = useCalendarFilters();

  return {
    // Events and data
    events: eventsQuery.events,
    tasks: eventsQuery.tasks,
    isLoading: eventsQuery.isLoading,
    error: eventsQuery.error,
    refetch: eventsQuery.refetch,

    // Drag and drop
    handleEventDrop: dragDropHook.handleEventDrop,
    isUpdating: dragDropHook.isUpdating,
    updateError: dragDropHook.error,

    // Filters and view management
    handleDateRangeChange: filtersHook.handleDateRangeChange,
    handleViewChange: filtersHook.handleViewChange,
  };
};
