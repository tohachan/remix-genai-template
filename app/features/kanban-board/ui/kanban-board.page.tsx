import React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { cn } from '~/shared/lib/utils';
import { useKanbanBoard, useDragEnd } from '../hooks';
import KanbanColumn from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import type { Task } from '~/entities/task';

interface KanbanBoardProps {
  projectId?: string;
  className?: string;
}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ projectId, className }, ref) => {
    const { tasksByStatus, isLoadingTasks } = useKanbanBoard(projectId);
    const { handleDragEnd } = useDragEnd();
    const [activeTask, setActiveTask] = React.useState<Task | null>(null);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
    );

    const handleDragStart = (event: any) => {
      const taskId = event.active.id;
      // Find the task across all status groups
      const allTasks = [
        ...tasksByStatus.todo,
        ...tasksByStatus['in-progress'],
        ...tasksByStatus.done,
      ];
      const task = allTasks.find(t => t.id === taskId);
      setActiveTask(task || null);
    };

    const handleDragEndInternal = (event: any) => {
      setActiveTask(null);
      handleDragEnd(event);
    };

    const columns = [
      { id: 'todo' as const, title: 'To Do', tasks: tasksByStatus.todo },
      { id: 'in-progress' as const, title: 'In Progress', tasks: tasksByStatus['in-progress'] },
      { id: 'done' as const, title: 'Done', tasks: tasksByStatus.done },
    ];

    if (isLoadingTasks) {
      return (
        <div ref={ref} className={cn('flex items-center justify-center min-h-[400px]', className)}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('w-full h-full', className)}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndInternal}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 opacity-90">
                <KanbanTaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    );
  },
);

KanbanBoard.displayName = 'KanbanBoard';

export default KanbanBoard;
