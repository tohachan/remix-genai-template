import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DndContext } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import type { Task } from '~/entities/task';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test description 1',
    status: 'todo',
    priority: 'medium',
    projectId: 'project-1',
    dependencies: [],
    createdBy: 'user1',
    tags: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Test description 2',
    status: 'todo',
    priority: 'high',
    projectId: 'project-1',
    dependencies: [],
    createdBy: 'user1',
    tags: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const renderWithDnd = (children: React.ReactNode) => {
  return render(
    <DndContext>
      {children}
    </DndContext>,
  );
};

describe('KanbanColumn', () => {
  it('renders column title and task count', () => {
    renderWithDnd(
      <KanbanColumn id="todo" title="To Do" tasks={mockTasks} />,
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders tasks in the column', () => {
    renderWithDnd(
      <KanbanColumn id="todo" title="To Do" tasks={mockTasks} />,
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('renders empty column when no tasks provided', () => {
    renderWithDnd(
      <KanbanColumn id="todo" title="To Do" tasks={[]} />,
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
