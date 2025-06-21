import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '~/shared/lib/utils';
import type { Task, TaskStatus } from '~/entities/task';
import { KanbanTaskCard } from './KanbanTaskCard';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color?: string;
  showSelectionMode?: boolean;
  selectedTasks?: Set<string>;
  onTaskSelect?: (taskId: string) => void;
  className?: string;
}

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({
    id,
    title,
    tasks,
    color = 'bg-gray-100',
    showSelectionMode = false,
    selectedTasks = new Set(),
    onTaskSelect,
    className,
  }, ref) => {
    const [isClient, setIsClient] = useState(false);

    // Ensure this only runs on the client side
    useEffect(() => {
      setIsClient(true);
    }, []);

    // Always call the hook, but only use the result if on client
    const droppableResult = useDroppable({ id });

    const { setNodeRef, isOver } = isClient
      ? droppableResult
      : { setNodeRef: () => {}, isOver: false };

    const getColumnHeaderColor = (columnId: TaskStatus) => {
      switch (columnId) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
      }
    };

    const getDropZoneColor = (columnId: TaskStatus, isOver: boolean) => {
      if (!isOver) return '';

      switch (columnId) {
      case 'todo':
        return 'bg-gray-100 border-gray-300';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300';
      case 'done':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col bg-gray-50 rounded-lg p-4 min-h-[500px] w-80 transition-all duration-200',
          isOver && getDropZoneColor(id, true),
          isOver && 'ring-2 ring-offset-2',
          className,
        )}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className={cn(
              'w-2 h-2 rounded-full',
              id === 'todo' && 'bg-gray-400',
              id === 'in-progress' && 'bg-blue-400',
              id === 'done' && 'bg-green-400',
            )} />
          </div>

          <div className="flex items-center gap-2">
            <span className={cn(
              'px-2 py-1 rounded-full text-sm font-medium',
              getColumnHeaderColor(id),
            )}>
              {tasks.length}
            </span>
          </div>
        </div>

        {/* Column Description */}
        <div className="mb-3 text-xs text-gray-500">
          {id === 'todo' && 'Tasks ready to be worked on'}
          {id === 'in-progress' && 'Tasks currently being worked on'}
          {id === 'done' && 'Completed tasks'}
        </div>

        {/* Drop Zone */}
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 space-y-3 min-h-96 p-2 rounded-md transition-all duration-200',
            isOver && 'ring-2 ring-blue-300 ring-offset-2',
            isOver && getDropZoneColor(id, true),
            tasks.length === 0 && 'border-2 border-dashed border-gray-300',
          )}
        >
          {tasks.length === 0 && !isOver && (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <svg className="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">No tasks</p>
              <p className="text-xs">Drop tasks here</p>
            </div>
          )}

          {isOver && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-blue-600">
              <svg className="h-8 w-8 mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <p className="text-sm font-medium">Drop here</p>
            </div>
          )}

          {isClient ? (
            <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => {
                const cardProps = {
                  task,
                  isSelected: selectedTasks.has(task.id),
                  showSelectionCheckbox: showSelectionMode,
                  ...(onTaskSelect && { onSelect: onTaskSelect }),
                };

                return <KanbanTaskCard key={task.id} {...cardProps} />;
              })}
            </SortableContext>
          ) : (
            <>
              {tasks.map((task) => {
                const cardProps = {
                  task,
                  isSelected: selectedTasks.has(task.id),
                  showSelectionCheckbox: showSelectionMode,
                  ...(onTaskSelect && { onSelect: onTaskSelect }),
                };

                return <KanbanTaskCard key={task.id} {...cardProps} />;
              })}
            </>
          )}
        </div>

        {/* Column Footer */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {tasks.filter(task => task.priority === 'high').length} high priority
            </span>
            {tasks.length > 0 && (
              <span>
                {Math.round((tasks.filter(task => task.status === id).length / tasks.length) * 100)}% of workload
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn;
