/**
 * Kanban Board Hooks
 * React hooks specific to kanban board functionality
 * Following layer boundaries: hooks orchestrate task management API calls
 */

import { useCallback, useMemo } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTaskManagement } from '../task-management/hooks';
import type { Task, TaskStatus } from '~/entities/task';

/**
 * Hook for organizing tasks by status for kanban columns
 */
export const useKanbanBoard = (projectId?: string) => {
  const { tasks, isLoadingTasks, updateTaskStatus, isUpdatingStatus } = useTaskManagement(
    projectId ? { projectId } : undefined,
  );

  const tasksByStatus = useMemo(() => {
    const grouped = {
      todo: [] as Task[],
      'in-progress': [] as Task[],
      done: [] as Task[],
    };

    tasks.forEach((task) => {
      if (task.status in grouped) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  return {
    tasksByStatus,
    isLoadingTasks,
    updateTaskStatus,
    isUpdatingStatus,
  };
};

/**
 * Hook for handling drag-and-drop operations
 */
export const useDragEnd = () => {
  const { updateTaskStatus } = useTaskManagement();

  const handleDragEnd = useCallback(async(event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // If dropping over a different column (status change)
    if (over.id !== active.data.current?.sortable?.containerId) {
      const newStatus = over.id as TaskStatus;
      const taskId = active.id as string;

      try {
        await updateTaskStatus(taskId, newStatus);
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  }, [updateTaskStatus]);

  return {
    handleDragEnd,
  };
};

/**
 * Hook for kanban board filtering and search
 */
export const useKanbanFilters = (initialProjectId?: string) => {
  const { tasks, isLoadingTasks } = useTaskManagement(
    initialProjectId ? { projectId: initialProjectId } : undefined,
  );

  const filterTasksBySearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return tasks;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerSearchTerm) ||
      task.description.toLowerCase().includes(lowerSearchTerm) ||
      task.assignee?.toLowerCase().includes(lowerSearchTerm),
    );
  }, [tasks]);

  const filterTasksByPriority = useCallback((priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  return {
    tasks,
    isLoadingTasks,
    filterTasksBySearch,
    filterTasksByPriority,
  };
};
