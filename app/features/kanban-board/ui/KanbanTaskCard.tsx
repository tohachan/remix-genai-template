import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '~/shared/lib/utils';
import type { Task } from '~/entities/task';

interface KanbanTaskCardProps {
  task: Task;
  className?: string;
}

const KanbanTaskCard = React.forwardRef<HTMLDivElement, KanbanTaskCardProps>(
  ({ task, className }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const getPriorityColor = (priority: Task['priority']) => {
      switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          'bg-white rounded-lg p-3 shadow-sm border-l-4 cursor-grab active:cursor-grabbing',
          getPriorityColor(task.priority),
          isDragging && 'opacity-50 shadow-lg',
          className,
        )}
      >
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm leading-tight">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-gray-600 text-xs line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className={cn(
              'px-2 py-1 rounded-full uppercase font-medium',
              task.priority === 'high' && 'bg-red-100 text-red-800',
              task.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
              task.priority === 'low' && 'bg-green-100 text-green-800',
            )}>
              {task.priority}
            </span>

            {task.assignee && (
              <span className="text-gray-500">
                {task.assignee}
              </span>
            )}
          </div>

          {task.deadline && (
            <div className="text-xs text-gray-500">
              Due: {new Date(task.deadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  },
);

KanbanTaskCard.displayName = 'KanbanTaskCard';

export { KanbanTaskCard };
