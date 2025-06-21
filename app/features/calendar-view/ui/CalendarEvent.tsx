import * as React from 'react';
import { cn } from '~/shared/lib/utils';
import type { Task } from '~/entities/task';

interface CalendarEventProps {
  task: Task;
  className?: string;
}

const CalendarEvent = React.forwardRef<
  HTMLDivElement,
  CalendarEventProps
>(({ task, className, ...props }, ref) => {
  const priorityColors = {
    low: 'bg-green-100 border-green-300 text-green-800',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    high: 'bg-red-100 border-red-300 text-red-800',
  };

  const statusColors = {
    todo: 'border-l-gray-400',
    'in-progress': 'border-l-blue-400',
    done: 'border-l-green-400',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'p-2 text-xs rounded border-l-4 cursor-pointer',
        priorityColors[task.priority],
        statusColors[task.status],
        className,
      )}
      {...props}
    >
      <div className="font-semibold truncate">{task.title}</div>
      {task.assigneeId && (
        <div className="text-gray-600 truncate">@{task.assigneeId}</div>
      )}
    </div>
  );
});

CalendarEvent.displayName = 'CalendarEvent';

export { CalendarEvent };
