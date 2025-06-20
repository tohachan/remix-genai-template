import { render, screen } from '@testing-library/react';
import { CalendarEvent } from './CalendarEvent';
import type { Task } from '~/entities/task';

const mockTask: Task = {
  id: '1',
  title: 'Sample Task',
  description: 'Sample description',
  status: 'todo',
  priority: 'high',
  assignee: 'john.doe',
  deadline: '2024-06-25',
  projectId: 'project-1',
  dependencies: [],
  createdAt: '2024-06-20T10:00:00Z',
  updatedAt: '2024-06-20T10:00:00Z',
};

describe('CalendarEvent', () => {
  it('renders task title', () => {
    render(<CalendarEvent task={mockTask} />);
    expect(screen.getByText('Sample Task')).toBeInTheDocument();
  });

  it('renders assignee when provided', () => {
    render(<CalendarEvent task={mockTask} />);
    expect(screen.getByText('@john.doe')).toBeInTheDocument();
  });

  it('does not render assignee when not provided', () => {
    const { assignee, ...taskWithoutAssignee } = mockTask;
    render(<CalendarEvent task={taskWithoutAssignee} />);
    expect(screen.queryByText('@')).not.toBeInTheDocument();
  });

  it('applies correct priority styles for high priority', () => {
    const { container } = render(<CalendarEvent task={mockTask} />);
    const eventElement = container.firstChild as HTMLElement;
    expect(eventElement).toHaveClass('bg-red-100', 'border-red-300', 'text-red-800');
  });

  it('applies correct status styles for todo status', () => {
    const { container } = render(<CalendarEvent task={mockTask} />);
    const eventElement = container.firstChild as HTMLElement;
    expect(eventElement).toHaveClass('border-l-gray-400');
  });

  it('applies correct status styles for in-progress status', () => {
    const inProgressTask = { ...mockTask, status: 'in-progress' as const };
    const { container } = render(<CalendarEvent task={inProgressTask} />);
    const eventElement = container.firstChild as HTMLElement;
    expect(eventElement).toHaveClass('border-l-blue-400');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<CalendarEvent task={mockTask} className="custom-class" />);
    const eventElement = container.firstChild as HTMLElement;
    expect(eventElement).toHaveClass('custom-class');
  });
});
