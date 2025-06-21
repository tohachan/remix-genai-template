import React from 'react';
import { cn } from '~/shared/lib/utils';
import type { Task } from '~/entities/task/model/types';

interface TaskCardProps {
  task: Task;
  className?: string;
  onClick?: () => void;
}

const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, className, onClick }, ref) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'todo': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer',
          className,
        )}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <div className="flex gap-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(task.priority))}>
              {task.priority}
            </span>
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(task.status))}>
              {task.status}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
        )}

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex flex-col gap-1">
            {task.assigneeId && (
              <span><strong>Assignee:</strong> {task.assigneeId}</span>
            )}
            {task.deadline && (
              <span><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

TaskCard.displayName = 'TaskCard';

export default TaskCard;
