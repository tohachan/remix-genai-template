import * as React from 'react';
import { cn } from '~/shared/lib/utils';

interface TaskListProps {
  children?: React.ReactNode;
  className?: string;
}

const TaskList = React.forwardRef<
  HTMLDivElement,
  TaskListProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'p-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

TaskList.displayName = 'TaskList';

export { TaskList };
