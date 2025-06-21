import React from 'react';
import { cn } from '~/shared/lib/utils';
import type { TaskStatus } from '~/entities/task';

interface KanbanBulkActionsProps {
  selectedCount: number;
  onStatusChange: (status: TaskStatus) => void;
  onClearSelection: () => void;
  onSelectAll: () => void;
  isUpdating?: boolean;
  className?: string;
}

const KanbanBulkActions = React.forwardRef<HTMLDivElement, KanbanBulkActionsProps>(
  ({ selectedCount, onStatusChange, onClearSelection, onSelectAll, isUpdating = false, className }, ref) => {
    if (selectedCount === 0) {
      return (
        <div ref={ref} className={cn('flex items-center justify-between p-3 bg-gray-50 rounded-lg border', className)}>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Select multiple tasks to perform bulk actions
          </div>

          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Select All
          </button>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200', className)}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
            </svg>
            {selectedCount} {selectedCount === 1 ? 'task' : 'tasks'} selected
          </div>

          {/* Status Change Actions */}
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 mr-2">Move to:</span>

            <button
              onClick={() => onStatusChange('todo')}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              To Do
            </button>

            <button
              onClick={() => onStatusChange('in-progress')}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              In Progress
            </button>

            <button
              onClick={() => onStatusChange('done')}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isUpdating && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Updating...
            </div>
          )}

          <button
            onClick={onClearSelection}
            disabled={isUpdating}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Selection
          </button>
        </div>
      </div>
    );
  },
);

KanbanBulkActions.displayName = 'KanbanBulkActions';

export { KanbanBulkActions };
