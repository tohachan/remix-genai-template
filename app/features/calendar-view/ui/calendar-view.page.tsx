import * as React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '~/shared/lib/utils';
import { useCalendar } from '../hooks';
import { CalendarEvent } from './CalendarEvent';
import type { Task } from '~/entities/task';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  projectId?: string;
  className?: string;
}

// Client-side only calendar component to avoid SSR issues
const ClientOnlyCalendar = React.forwardRef<
  HTMLDivElement,
  CalendarViewProps
>(({ projectId, className, ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    events,
    isLoading,
    error,
    handleDateRangeChange,
    handleViewChange,
  } = useCalendar(projectId);

  const handleSelectEvent = React.useCallback((event: any) => {
    console.log('Event selected:', event);
    // Could implement event editing modal here
  }, []);

  const CustomEvent = React.useCallback(({ event }: { event: any }) => {
    return <CalendarEvent task={event.resource as Task} />;
  }, []);

  if (!mounted) {
    // Show loading during hydration to prevent SSR mismatch
    return (
      <div
        ref={ref}
        className={cn(
          'h-96 bg-white rounded-lg shadow-sm border flex items-center justify-center',
          className,
        )}
        {...props}
      >
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={ref}
        className={cn(
          'h-96 bg-white rounded-lg shadow-sm border p-4',
          className,
        )}
        {...props}
      >
        <div className="text-red-600">
          Error loading calendar events: {error.toString()}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        'h-96 bg-white rounded-lg shadow-sm border',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading calendar events...</div>
        </div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          onRangeChange={handleDateRangeChange}
          onView={handleViewChange}
          components={{
            event: CustomEvent,
          }}
          views={['month', 'week', 'day']}
          defaultView="month"
          popup
          popupOffset={{ x: 30, y: 20 }}
        />
      )}
    </div>
  );
});

ClientOnlyCalendar.displayName = 'ClientOnlyCalendar';

const CalendarView = ClientOnlyCalendar;

CalendarView.displayName = 'CalendarView';

export { CalendarView };
export default CalendarView;
