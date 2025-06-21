import React from 'react';
import type { Task } from '~/entities/task';

interface KanbanBoardStatsProps {
  filteredTasks: Task[];
  filteredTasksByStatus: {
    todo: Task[];
    'in-progress': Task[];
    done: Task[];
  };
}

const KanbanBoardStats: React.FC<KanbanBoardStatsProps> = ({
  filteredTasks,
  filteredTasksByStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{filteredTasks.length}</div>
        <div className="text-sm text-gray-500">Total Tasks</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">
          {filteredTasksByStatus['in-progress'].length}
        </div>
        <div className="text-sm text-gray-500">In Progress</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {filteredTasksByStatus.done.length}
        </div>
        <div className="text-sm text-gray-500">Completed</div>
      </div>
    </div>
  );
};

export default KanbanBoardStats;
