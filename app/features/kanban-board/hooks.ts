/**
 * Kanban Board Hooks
 * React hooks specific to kanban board functionality
 * Following layer boundaries: hooks orchestrate task management API calls
 */

import React, { useCallback, useMemo, useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTaskManagement } from '../task-management/hooks';
import type { Task, TaskStatus } from '~/entities/task';

/**
 * Column status configuration for kanban board
 */
export const KANBAN_COLUMNS = [
  { id: 'todo' as const, title: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress' as const, title: 'In Progress', color: 'bg-blue-100' },
  { id: 'done' as const, title: 'Done', color: 'bg-green-100' },
] as const;

/**
 * Hook for organizing tasks by status for kanban columns with enhanced functionality
 */
export const useKanbanBoard = (projectId?: string) => {
  const { tasks, isLoadingTasks, updateTaskStatus, isUpdatingStatus } = useTaskManagement(
    projectId ? { projectId } : undefined,
  );

  // State for optimistic updates
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Use optimistic tasks when available, fallback to real tasks
  const currentTasks = optimisticTasks.length > 0 ? optimisticTasks : tasks;

  const tasksByStatus = useMemo(() => {
    const grouped = {
      todo: [] as Task[],
      'in-progress': [] as Task[],
      done: [] as Task[],
    };

    currentTasks.forEach((task) => {
      if (task.status in grouped) {
        grouped[task.status].push(task);
      }
    });

    // Sort tasks by priority within each column (high -> medium -> low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    Object.keys(grouped).forEach(status => {
      grouped[status as TaskStatus].sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // Secondary sort by creation date (newest first)
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      });
    });

    return grouped;
  }, [currentTasks]);

  // Reset optimistic updates when real tasks change
  React.useEffect(() => {
    if (!isUpdatingStatus && optimisticTasks.length > 0) {
      setOptimisticTasks([]);
    }
  }, [tasks, isUpdatingStatus, optimisticTasks.length]);

  return {
    tasksByStatus,
    isLoadingTasks,
    updateTaskStatus,
    isUpdatingStatus,
    columns: KANBAN_COLUMNS,
    setOptimisticTasks,
    setDraggedTask,
    draggedTask,
  };
};

/**
 * Hook for handling drag-and-drop operations with optimistic updates
 */
export const useDragEnd = () => {
  const { updateTaskStatus } = useTaskManagement();

  const handleDragEnd = useCallback(async(
    event: DragEndEvent,
    tasks: Task[],
    setOptimisticTasks: (tasks: Task[]) => void,
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    const activeContainer = active.data.current?.sortable?.containerId as TaskStatus;
    const overContainer = over.data.current?.sortable?.containerId || over.id as TaskStatus;

    // Handle cross-column movement (status change)
    if (activeContainer !== overContainer) {
      // Optimistic update
      const updatedTasks = tasks.map(task =>
        task.id === activeId
          ? { ...task, status: overContainer }
          : task,
      );
      setOptimisticTasks(updatedTasks);

      try {
        await updateTaskStatus(activeId, overContainer);
        // Success - optimistic update will be cleared when real data arrives
      } catch (error) {
        // Rollback on error
        console.error('Failed to update task status:', error);
        setOptimisticTasks([]);
        // Could show toast notification here
      }
    } else {
      // Handle within-column reordering
      const columnTasks = tasks.filter(task => task.status === activeContainer);
      const activeIndex = columnTasks.findIndex(task => task.id === activeId);
      const overIndex = columnTasks.findIndex(task => task.id === overId);

      if (activeIndex !== overIndex) {
        const reorderedColumnTasks = arrayMove(columnTasks, activeIndex, overIndex);

        // Update the full task list with reordered column
        const updatedTasks = tasks.map(task => {
          if (task.status === activeContainer) {
            const newPosition = reorderedColumnTasks.findIndex(t => t.id === task.id);
            return { ...task, sortOrder: newPosition };
          }
          return task;
        });

        setOptimisticTasks(updatedTasks);

        // Note: In a real app, you might want to persist the sort order to the backend
        // For now, we'll just apply the optimistic update
        setTimeout(() => setOptimisticTasks([]), 500); // Clear after short delay
      }
    }
  }, [updateTaskStatus]);

  return {
    handleDragEnd,
  };
};

/**
 * Hook for kanban board filtering and search with enhanced functionality
 */
export const useKanbanFilters = (initialProjectId?: string) => {
  const { tasks, isLoadingTasks } = useTaskManagement(
    initialProjectId ? { projectId: initialProjectId } : undefined,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority'] | 'all'>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string | 'all'>('all');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(lowerSearchTerm) ||
        task.description.toLowerCase().includes(lowerSearchTerm) ||
        task.assigneeId?.toLowerCase().includes(lowerSearchTerm),
      );
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Assignee filter
    if (selectedAssignee !== 'all') {
      filtered = filtered.filter(task => task.assigneeId === selectedAssignee);
    }

    return filtered;
  }, [tasks, searchTerm, selectedPriority, selectedAssignee]);

  // Get unique assignees for filter dropdown
  const uniqueAssignees = useMemo(() => {
    const assignees = tasks
      .map(task => task.assigneeId)
      .filter((assignee): assignee is string => Boolean(assignee));
    return Array.from(new Set(assignees));
  }, [tasks]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedPriority('all');
    setSelectedAssignee('all');
  }, []);

  return {
    tasks: filteredTasks,
    isLoadingTasks,
    searchTerm,
    setSearchTerm,
    selectedPriority,
    setSelectedPriority,
    selectedAssignee,
    setSelectedAssignee,
    uniqueAssignees,
    clearFilters,
    hasActiveFilters: searchTerm !== '' || selectedPriority !== 'all' || selectedAssignee !== 'all',
  };
};

/**
 * Hook for bulk operations on kanban board
 */
export const useBulkOperations = () => {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const { updateTaskStatus } = useTaskManagement();

  const toggleTaskSelection = useCallback((taskId: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  }, []);

  const selectAllTasks = useCallback((taskIds: string[]) => {
    setSelectedTasks(new Set(taskIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTasks(new Set());
  }, []);

  const bulkUpdateStatus = useCallback(async(newStatus: TaskStatus) => {
    const taskIds = Array.from(selectedTasks);

    try {
      // Execute all updates in parallel
      await Promise.all(
        taskIds.map(taskId => updateTaskStatus(taskId, newStatus)),
      );
      clearSelection();
    } catch (error) {
      console.error('Failed to bulk update task status:', error);
      // Could show error notification here
    }
  }, [selectedTasks, updateTaskStatus, clearSelection]);

  return {
    selectedTasks,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    bulkUpdateStatus,
    hasSelection: selectedTasks.size > 0,
    selectionCount: selectedTasks.size,
  };
};
