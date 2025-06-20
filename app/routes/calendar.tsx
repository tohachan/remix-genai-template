import type { MetaFunction } from '@remix-run/node';
import { CalendarView } from '~/features/calendar-view';

export const meta: MetaFunction = () => {
  return [
    { title: 'Calendar View - Task Management' },
    { name: 'description', content: 'Calendar view for task deadlines and scheduling' },
  ];
};

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Task Calendar
        </h1>
        <p className="text-gray-600">
          View and manage task deadlines in calendar format. Tasks with deadlines will appear as events.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <CalendarView className="h-[600px]" />
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> Only tasks with assigned deadlines will appear on the calendar.
          Color coding represents task priority: green (low), yellow (medium), red (high).
          Border colors indicate status: gray (todo), blue (in-progress), green (done).
        </p>
      </div>
    </div>
  );
}
