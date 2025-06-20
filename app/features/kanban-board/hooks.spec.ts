/**
 * Kanban Board Hooks Tests
 * Unit tests for kanban board hooks
 */

import { renderHook } from '@testing-library/react';
import { useKanbanBoard, useDragEnd, useKanbanFilters } from './hooks';

// Mock the task management hooks
jest.mock('../task-management/hooks', () => ({
  useTaskManagement: jest.fn(() => ({
    tasks: [
      {
        id: '1',
        title: 'Test Task 1',
        status: 'todo',
        priority: 'high',
        projectId: 'project-1',
        dependencies: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        title: 'Test Task 2',
        status: 'in-progress',
        priority: 'medium',
        projectId: 'project-1',
        dependencies: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
    isLoadingTasks: false,
    updateTaskStatus: jest.fn(),
    isUpdatingStatus: false,
  })),
}));

describe('useKanbanBoard', () => {
  it('should organize tasks by status', () => {
    const { result } = renderHook(() => useKanbanBoard());

    expect(result.current.tasksByStatus.todo).toHaveLength(1);
    expect(result.current.tasksByStatus['in-progress']).toHaveLength(1);
    expect(result.current.tasksByStatus.done).toHaveLength(0);
  });

  it('should return loading state', () => {
    const { result } = renderHook(() => useKanbanBoard());

    expect(result.current.isLoadingTasks).toBe(false);
  });
});

describe('useDragEnd', () => {
  it('should return handleDragEnd function', () => {
    const { result } = renderHook(() => useDragEnd());

    expect(typeof result.current.handleDragEnd).toBe('function');
  });
});

describe('useKanbanFilters', () => {
  it('should return filter functions', () => {
    const { result } = renderHook(() => useKanbanFilters());

    expect(typeof result.current.filterTasksBySearch).toBe('function');
    expect(typeof result.current.filterTasksByPriority).toBe('function');
  });
});
