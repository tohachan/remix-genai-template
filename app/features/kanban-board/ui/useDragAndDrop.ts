import { useState, useEffect } from 'react';
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useDragEnd } from '../hooks';
import type { Task } from '~/entities/task';

export const useDragAndDrop = (
  tasksByStatus: {
    todo: Task[];
    'in-progress': Task[];
    done: Task[];
  },
  setOptimisticTasks: (tasks: any) => void,
  setDraggedTask: (task: Task | null) => void,
) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { handleDragEnd } = useDragEnd();

  // Ensure this only runs on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always call the hook, but return different sensors based on client state
  const clientSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    // Find the task across all status groups
    const allTasks = [
      ...tasksByStatus.todo,
      ...tasksByStatus['in-progress'],
      ...tasksByStatus.done,
    ];
    const task = allTasks.find(t => t.id === taskId);
    setActiveTask(task || null);
    setDraggedTask(task || null);
  };

  const handleDragEndInternal = (event: DragEndEvent) => {
    const allTasks = [
      ...tasksByStatus.todo,
      ...tasksByStatus['in-progress'],
      ...tasksByStatus.done,
    ];

    handleDragEnd(event, allTasks, setOptimisticTasks);
    setActiveTask(null);
    setDraggedTask(null);
  };

  return {
    activeTask,
    sensors: isClient ? clientSensors : [],
    handleDragStart,
    handleDragEnd: handleDragEndInternal,
    isClient,
  };
};
