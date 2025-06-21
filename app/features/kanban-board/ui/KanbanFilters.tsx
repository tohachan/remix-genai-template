import React from 'react';
import { cn } from '~/shared/lib/utils';
import type { Task } from '~/entities/task';

interface KanbanFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPriority: Task['priority'] | 'all';
  setSelectedPriority: (priority: Task['priority'] | 'all') => void;
  selectedAssignee: string | 'all';
  setSelectedAssignee: (assignee: string | 'all') => void;
  uniqueAssignees: string[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

const KanbanFilters = React.forwardRef<HTMLDivElement, KanbanFiltersProps>(
  ({
    searchTerm,
    setSearchTerm,
    selectedPriority,
    setSelectedPriority,
    selectedAssignee,
    setSelectedAssignee,
    uniqueAssignees,
    clearFilters,
    hasActiveFilters,
    className,
  }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm border', className)}>
        {/* Search Input */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Task['priority'] | 'all')}
            className="block w-32 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="assignee-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Assignee:
          </label>
          <select
            id="assignee-filter"
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
          >
            <option value="all">All</option>
            {uniqueAssignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}

        {/* Filter Status Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters active</span>
          </div>
        )}
      </div>
    );
  },
);

KanbanFilters.displayName = 'KanbanFilters';

export { KanbanFilters };
