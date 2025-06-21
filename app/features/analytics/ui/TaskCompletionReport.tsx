import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CompletionStats } from '~/shared/lib/utils/analytics';

interface TaskCompletionReportProps {
  stats: CompletionStats;
  height?: number;
  className?: string;
}

const COLORS = {
  completed: '#10b981',
  inProgress: '#f59e0b',
  todo: '#6b7280',
  overdue: '#ef4444',
};

export default function TaskCompletionReport({
  stats,
  height = 300,
  className = '',
}: TaskCompletionReportProps) {
  const pieData = [
    { name: 'Completed', value: stats.completed, color: COLORS.completed },
    { name: 'In Progress', value: stats.inProgress, color: COLORS.inProgress },
    { name: 'To Do', value: stats.todo, color: COLORS.todo },
    { name: 'Overdue', value: stats.overdue, color: COLORS.overdue },
  ].filter(item => item.value > 0);

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistics Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Tasks</span>
              <span className="text-2xl font-bold text-gray-900">{stats.totalTasks}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Completion Rate</span>
              <span className="text-2xl font-bold text-green-600">{stats.completionRate}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">{stats.completed}</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-700">{stats.inProgress}</div>
                <div className="text-xs text-yellow-600">In Progress</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700">{stats.todo}</div>
                <div className="text-xs text-gray-600">To Do</div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="text-center">
                <div className="text-lg font-bold text-red-700">{stats.overdue}</div>
                <div className="text-xs text-red-600">Overdue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <p>No task data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
