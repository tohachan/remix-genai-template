import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
} from '@dnd-kit/core';
import { cn } from '~/shared/lib/utils';
import {
  useKanbanBoard,
  useKanbanFilters,
  useBulkOperations,
} from '../hooks';
import KanbanColumn from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';
import { KanbanFilters } from './KanbanFilters';
import { KanbanBulkActions } from './KanbanBulkActions';
import KanbanBoardHeader from './KanbanBoardHeader';
import KanbanBoardStats from './KanbanBoardStats';
import { useDragAndDrop } from './useDragAndDrop';
import type { Task } from '~/entities/task';

interface KanbanBoardProps {
  projectId?: string;
  className?: string;
}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ projectId, className }, ref) => {
    // Enhanced state management
    const [selectionMode, setSelectionMode] = useState(false);

    // Enhanced hooks with optimistic updates
    const {
      tasksByStatus,
      isLoadingTasks,
      columns,
      setOptimisticTasks,
      setDraggedTask,
    } = useKanbanBoard(projectId);

    // Drag and drop logic
    const { activeTask, sensors, handleDragStart, handleDragEnd, isClient } = useDragAndDrop(
      tasksByStatus,
      setOptimisticTasks,
      setDraggedTask,
    );

    // Filtering functionality
    const {
      tasks: filteredTasks,
      searchTerm,
      setSearchTerm,
      selectedPriority,
      setSelectedPriority,
      selectedAssignee,
      setSelectedAssignee,
      uniqueAssignees,
      clearFilters,
      hasActiveFilters,
    } = useKanbanFilters(projectId);

    // Bulk operations functionality
    const {
      selectedTasks,
      toggleTaskSelection,
      selectAllTasks,
      clearSelection,
      bulkUpdateStatus,
      hasSelection,
      selectionCount,
    } = useBulkOperations();

    // Apply filters to tasks by status
    const filteredTasksByStatus = useMemo(() => {
      const grouped = {
        todo: [] as Task[],
        'in-progress': [] as Task[],
        done: [] as Task[],
      };

      filteredTasks.forEach((task) => {
        if (task.status in grouped) {
          grouped[task.status].push(task);
        }
      });

      return grouped;
    }, [filteredTasks]);

    // Get all filtered task IDs for bulk operations
    const allFilteredTaskIds = useMemo(() => {
      return filteredTasks.map(task => task.id);
    }, [filteredTasks]);

    const toggleSelectionMode = () => {
      setSelectionMode(!selectionMode);
      if (selectionMode) {
        clearSelection();
      }
    };

    const handleSelectAllVisible = () => {
      selectAllTasks(allFilteredTaskIds);
    };

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
      <div ref={ref} className={cn('w-full h-full space-y-6', className)}>
        {/* Board Header */}
        <KanbanBoardHeader
          projectId={projectId}
          selectionMode={selectionMode}
          onToggleSelectionMode={toggleSelectionMode}
        />

        {/* Enhanced Filters */}
        <KanbanFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          selectedAssignee={selectedAssignee}
          setSelectedAssignee={setSelectedAssignee}
          uniqueAssignees={uniqueAssignees}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Bulk Actions */}
        {selectionMode && (
          <KanbanBulkActions
            selectedCount={selectionCount}
            onStatusChange={bulkUpdateStatus}
            onClearSelection={clearSelection}
            onSelectAll={handleSelectAllVisible}
            isUpdating={false} // TODO: Connect to actual updating state
          />
        )}

        {/* Enhanced Kanban Board with Drag and Drop */}
        {isClient ? (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  tasks={filteredTasksByStatus[column.id]}
                  color={column.color}
                  showSelectionMode={selectionMode}
                  selectedTasks={selectedTasks}
                  onTaskSelect={toggleTaskSelection}
                />
              ))}
            </div>

            {/* Enhanced Drag Overlay */}
            <DragOverlay>
              {activeTask ? (
                <div className="rotate-3 opacity-90 scale-105 shadow-2xl">
                  <KanbanTaskCard task={activeTask} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={filteredTasksByStatus[column.id]}
                color={column.color}
                showSelectionMode={selectionMode}
                selectedTasks={selectedTasks}
                onTaskSelect={toggleTaskSelection}
              />
            ))}
          </div>
        )}

        {/* Statistics Footer */}
        <KanbanBoardStats
          filteredTasks={filteredTasks}
          filteredTasksByStatus={filteredTasksByStatus}
        />
      </div>
    );
  },
);

KanbanBoard.displayName = 'KanbanBoard';

export default KanbanBoard;
