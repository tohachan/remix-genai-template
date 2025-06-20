import React from 'react';
import { cn } from '~/shared/lib/utils';

interface TaskListProps {
  children?: React.ReactNode;
  className?: string;
}

const TaskList = React.forwardRef<HTMLDivElement, TaskListProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4', className)}
      >
        {children}
      </div>
    );
  },
);

TaskList.displayName = 'TaskList';

export default TaskList;
