import React from 'react';
import { cn } from '~/shared/lib/utils';

interface TaskFormProps {
  children?: React.ReactNode;
  className?: string;
}

const TaskForm = React.forwardRef<HTMLFormElement, TaskFormProps>(
  ({ children, className }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('p-4', className)}
      >
        {children}
      </form>
    );
  },
);

TaskForm.displayName = 'TaskForm';

export default TaskForm;
