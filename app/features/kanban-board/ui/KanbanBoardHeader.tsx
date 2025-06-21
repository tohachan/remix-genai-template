import React from 'react';
import { cn } from '~/shared/lib/utils';

interface KanbanBoardHeaderProps {
  projectId?: string | undefined;
  selectionMode: boolean;
  onToggleSelectionMode: () => void;
}

const KanbanBoardHeader: React.FC<KanbanBoardHeaderProps> = ({
  projectId,
  selectionMode,
  onToggleSelectionMode,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Kanban Board</h2>
        {projectId && (
          <span className="text-sm text-gray-500">Project: {projectId}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSelectionMode}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            selectionMode
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          )}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
          </svg>
          {selectionMode ? 'Exit Selection' : 'Multi-Select'}
        </button>
      </div>
    </div>
  );
};

export default KanbanBoardHeader;
