import React from 'react';
import { cn } from '~/shared/lib/utils';

interface TaskCardProps {
  children?: React.ReactNode;
  className?: string;
}

const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
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

TaskCard.displayName = 'TaskCard';

export default TaskCard;
