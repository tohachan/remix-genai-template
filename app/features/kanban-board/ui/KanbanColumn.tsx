import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '~/shared/lib/utils';
import type { Task, TaskStatus } from '~/entities/task';
import { KanbanTaskCard } from './KanbanTaskCard';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  className?: string;
}

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ id, title, tasks, className }, ref) => {
    const { setNodeRef, isOver } = useDroppable({
      id,
    });

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col bg-gray-50 rounded-lg p-4 min-h-[500px] w-80',
          isOver && 'bg-gray-100',
          className,
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </div>

        <div ref={setNodeRef} className="flex-1 space-y-3">
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <KanbanTaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
  },
);

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn;
