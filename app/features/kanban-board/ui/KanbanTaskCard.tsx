import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '~/shared/lib/utils';
import type { Task } from '~/entities/task';

interface KanbanTaskCardProps {
  task: Task;
  className?: string;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
  showSelectionCheckbox?: boolean;
}

const KanbanTaskCard = React.forwardRef<HTMLDivElement, KanbanTaskCardProps>(
  ({ task, className, isSelected = false, onSelect, showSelectionCheckbox = false }, ref) => {
    const [isClient, setIsClient] = useState(false);

    // Ensure this only runs on the client side
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Always call the hook, but only use the result if on client
    const sortableResult = useSortable({ id: task.id });

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = isClient
      ? sortableResult
      : {
        attributes: {},
        listeners: {},
        setNodeRef: () => {},
        transform: null,
        transition: undefined,
        isDragging: false,
      };

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

    const getPriorityBadgeColor = (priority: Task['priority']) => {
      switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
      }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (onSelect) {
        onSelect(task.id);
      }
    };

    const handleCardClick = (e: React.MouseEvent) => {
      if (showSelectionCheckbox && onSelect) {
        e.preventDefault();
        onSelect(task.id);
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'bg-white rounded-lg p-3 shadow-sm border-l-4 transition-all duration-200',
          getPriorityColor(task.priority),
          isDragging && 'opacity-50 shadow-lg z-50',
          isSelected && 'ring-2 ring-blue-500 bg-blue-50',
          showSelectionCheckbox ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing',
          className,
        )}
        onClick={handleCardClick}
      >
        {/* Selection checkbox and drag handle */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {showSelectionCheckbox && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={handleSelectChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {!showSelectionCheckbox && isClient && (
            <div
              {...attributes}
              {...listeners}
              className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="2" cy="2" r="1" />
                <circle cx="6" cy="2" r="1" />
                <circle cx="10" cy="2" r="1" />
                <circle cx="2" cy="6" r="1" />
                <circle cx="6" cy="6" r="1" />
                <circle cx="10" cy="6" r="1" />
                <circle cx="2" cy="10" r="1" />
                <circle cx="6" cy="10" r="1" />
                <circle cx="10" cy="10" r="1" />
              </svg>
            </div>
          )}
        </div>

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
              getPriorityBadgeColor(task.priority),
            )}>
              {task.priority}
            </span>

            {task.assigneeId && (
              <div className="flex items-center gap-1">
                {/* Avatar placeholder - in a real app this would show user avatar */}
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {task.assigneeId.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-500 max-w-16 truncate">
                  {task.assigneeId}
                </span>
              </div>
            )}
          </div>

          {task.deadline && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
          )}

          {/* Task dependencies indicator */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z"/>
                <path d="M7.5 4.21l4.5 2.6 4.5-2.6"/>
                <path d="M7.5 19.79V14l4.5-2.6 4.5 2.6v5.79"/>
              </svg>
              <span>{task.dependencies.length} deps</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

KanbanTaskCard.displayName = 'KanbanTaskCard';

export { KanbanTaskCard };
