import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DndContext } from '@dnd-kit/core';
import KanbanBoard from './kanban-board.page';

// Mock the hooks for feature components
const mockUseKanbanBoard = jest.fn();
const mockUseDragEnd = jest.fn();

jest.mock('../hooks', () => ({
  useKanbanBoard: () => mockUseKanbanBoard(),
  useDragEnd: () => mockUseDragEnd(),
}));

const renderWithDnd = (children: React.ReactNode) => {
  return render(
    <DndContext>
      {children}
    </DndContext>,
  );
};

describe('KanbanBoard', () => {
  beforeEach(() => {
    mockUseDragEnd.mockReturnValue({
      handleDragEnd: jest.fn(),
    });
  });

  it('renders without crashing', () => {
    mockUseKanbanBoard.mockReturnValue({
      tasksByStatus: {
        todo: [],
        'in-progress': [],
        done: [],
      },
      isLoadingTasks: false,
    });

    renderWithDnd(<KanbanBoard />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows loading state when tasks are loading', () => {
    mockUseKanbanBoard.mockReturnValue({
      tasksByStatus: {
        todo: [],
        'in-progress': [],
        done: [],
      },
      isLoadingTasks: true,
    });

    renderWithDnd(<KanbanBoard />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('renders kanban columns when not loading', () => {
    mockUseKanbanBoard.mockReturnValue({
      tasksByStatus: {
        todo: [],
        'in-progress': [],
        done: [],
      },
      isLoadingTasks: false,
    });

    renderWithDnd(<KanbanBoard />);

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
