import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CalendarView } from './calendar-view.page';
import type { Task } from '~/entities/task';

// Mock the hooks
jest.mock('../hooks', () => ({
  useCalendar: jest.fn(),
}));

// Mock react-big-calendar
jest.mock('react-big-calendar', () => ({
  Calendar: ({ events, onSelectEvent }: { events: any; onSelectEvent: any }) => (
    <div data-testid="calendar">
      <div data-testid="calendar-events">
        {events.map((event: any) => (
          <div
            key={event.id}
            data-testid={`calendar-event-${event.id}`}
            onClick={() => onSelectEvent(event)}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  ),
  dateFnsLocalizer: () => ({}),
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn(),
  parse: jest.fn(),
  startOfWeek: jest.fn(),
  getDay: jest.fn(),
}));

// Mock date-fns/locale
jest.mock('date-fns/locale', () => ({
  enUS: {},
}));

// Mock CalendarEvent component
jest.mock('./CalendarEvent', () => ({
  CalendarEvent: ({ task }: { task: Task }) => (
    <div data-testid={`task-${task.id}`}>{task.title}</div>
  ),
}));

import { useCalendar } from '../hooks';

const mockUseCalendar = useCalendar as jest.MockedFunction<typeof useCalendar>;

const mockEvents = [
  {
    id: '1',
    title: 'Task 1',
    start: new Date('2024-06-25'),
    end: new Date('2024-06-25'),
    resource: {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo' as const,
      priority: 'high' as const,
      deadline: '2024-06-25',
      projectId: 'project-1',
      dependencies: [],
      createdAt: '2024-06-20T10:00:00Z',
      updatedAt: '2024-06-20T10:00:00Z',
    },
  },
];

describe('CalendarView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state during hydration', () => {
    mockUseCalendar.mockReturnValue({
      events: [],
      tasks: [],
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
      handleEventDrop: jest.fn(),
      isUpdating: false,
      updateError: undefined,
      handleDateRangeChange: jest.fn(),
      handleViewChange: jest.fn(),
    });

    render(<CalendarView />);

    // During hydration, should show loading
    expect(screen.getByText('Loading calendar...')).toBeInTheDocument();
  });

  it('renders calendar with events after mounting', async() => {
    mockUseCalendar.mockReturnValue({
      events: mockEvents,
      tasks: [mockEvents[0]!.resource],
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
      handleEventDrop: jest.fn(),
      isUpdating: false,
      updateError: undefined,
      handleDateRangeChange: jest.fn(),
      handleViewChange: jest.fn(),
    });

    render(<CalendarView />);

    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    expect(screen.getByTestId('calendar-event-1')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });

  it('shows loading state when data is loading', async() => {
    mockUseCalendar.mockReturnValue({
      events: [],
      tasks: [],
      isLoading: true,
      error: undefined,
      refetch: jest.fn(),
      handleEventDrop: jest.fn(),
      isUpdating: false,
      updateError: undefined,
      handleDateRangeChange: jest.fn(),
      handleViewChange: jest.fn(),
    });

    render(<CalendarView />);

    // Wait for hydration loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading calendar...')).not.toBeInTheDocument();
    });

    // Should show data loading state
    expect(screen.getByText('Loading calendar events...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', async() => {
    const errorMessage = 'Failed to load events';
    const mockError = { status: 500, data: { message: errorMessage } };
    mockUseCalendar.mockReturnValue({
      events: [],
      tasks: [],
      isLoading: false,
      error: mockError,
      refetch: jest.fn(),
      handleEventDrop: jest.fn(),
      isUpdating: false,
      updateError: undefined,
      handleDateRangeChange: jest.fn(),
      handleViewChange: jest.fn(),
    });

    render(<CalendarView />);

    // Wait for hydration loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading calendar...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Error loading calendar events:/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockUseCalendar.mockReturnValue({
      events: [],
      tasks: [],
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
      handleEventDrop: jest.fn(),
      isUpdating: false,
      updateError: undefined,
      handleDateRangeChange: jest.fn(),
      handleViewChange: jest.fn(),
    });

    const { container } = render(<CalendarView className="custom-class" />);
    const calendarContainer = container.firstChild as HTMLElement;
    expect(calendarContainer).toHaveClass('custom-class');
  });

  it('filters events by project when projectId is provided', () => {
    const mockHandlers = {
      events: mockEvents,
      tasks: [mockEvents[0]!.resource],
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
      handleEventDrop: jest.fn(),
      isUpdating: false,
      updateError: undefined,
      handleDateRangeChange: jest.fn(),
      handleViewChange: jest.fn(),
    };

    mockUseCalendar.mockReturnValue(mockHandlers);

    render(<CalendarView projectId="project-1" />);

    expect(mockUseCalendar).toHaveBeenCalledWith('project-1');
  });
});
