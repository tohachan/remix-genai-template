// Jest is configured globally, no imports needed for describe, it, expect
import { renderHook } from '@testing-library/react';
import { useCalendar, useCalendarEvents, useTaskDragDrop } from './hooks';

// Mock the task management hooks
jest.mock('~/features/task-management/hooks', () => ({
  useTasks: jest.fn(() => ({
    tasks: [
      {
        id: '1',
        title: 'Test Task',
        deadline: '2024-06-25',
        priority: 'high',
        status: 'todo',
        projectId: 'proj-1',
        description: 'Test description',
        dependencies: [],
        createdAt: '2024-06-20T10:00:00Z',
        updatedAt: '2024-06-20T10:00:00Z',
      },
    ],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useUpdateTask: jest.fn(() => ({
    updateTask: jest.fn().mockResolvedValue({ id: '1' }),
    isLoading: false,
    error: null,
  })),
}));

describe('Calendar View Hooks', () => {
  describe('useCalendarEvents', () => {
    it('should transform tasks with deadlines into calendar events', () => {
      const { result } = renderHook(() => useCalendarEvents());

      expect(result.current.events).toHaveLength(1);
      expect(result.current.events[0]).toMatchObject({
        id: '1',
        title: 'Test Task',
      });
    });
  });

  describe('useTaskDragDrop', () => {
    it('should provide drag drop functionality', () => {
      const { result } = renderHook(() => useTaskDragDrop());

      expect(result.current.handleEventDrop).toBeInstanceOf(Function);
      expect(result.current.isUpdating).toBe(false);
    });
  });

  describe('useCalendar', () => {
    it('should provide complete calendar functionality', () => {
      const { result } = renderHook(() => useCalendar());

      expect(result.current.events).toBeDefined();
      expect(result.current.handleEventDrop).toBeInstanceOf(Function);
      expect(result.current.handleDateRangeChange).toBeInstanceOf(Function);
    });
  });
});
