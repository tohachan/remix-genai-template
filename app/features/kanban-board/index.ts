// Public API exports for the kanban-board feature slice

// Main page component
export { default } from './ui/kanban-board.page';
export { default as KanbanBoardPage } from './ui/kanban-board.page';

// UI Components
export { default as KanbanColumn } from './ui/KanbanColumn';
export { KanbanTaskCard } from './ui/KanbanTaskCard';
export { KanbanFilters } from './ui/KanbanFilters';
export { KanbanBulkActions } from './ui/KanbanBulkActions';
export { default as KanbanBoardHeader } from './ui/KanbanBoardHeader';
export { default as KanbanBoardStats } from './ui/KanbanBoardStats';

// Hooks
export {
  useKanbanBoard,
  useDragEnd,
  useKanbanFilters,
  useBulkOperations,
  KANBAN_COLUMNS,
} from './hooks';

// API
export * from './api';
