// UI Components
export { default as KanbanBoard } from './ui/kanban-board.page';
export { default as KanbanColumn } from './ui/KanbanColumn';
export { KanbanTaskCard } from './ui/KanbanTaskCard';

// Hooks
export { useKanbanBoard, useDragEnd, useKanbanFilters } from './hooks';

// API (re-exports from task management)
export {
  useGetTasksQuery,
  useUpdateTaskMutation,
} from './api';
