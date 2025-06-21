import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/ui/select';
import { Card } from '~/shared/ui/card';
import BurndownChart from './BurndownChart';
import TeamWorkloadChart from './TeamWorkloadChart';
import TaskCompletionReport from './TaskCompletionReport';
import { generateTimeRanges } from '~/shared/lib/utils/analytics';

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last-7-days');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Mock data for demonstration
  const mockBurndownData = [
    { date: 'Jan 01', remaining: 20, ideal: 20, completed: 0 },
    { date: 'Jan 02', remaining: 18, ideal: 18, completed: 2 },
    { date: 'Jan 03', remaining: 15, ideal: 16, completed: 5 },
    { date: 'Jan 04', remaining: 12, ideal: 14, completed: 8 },
    { date: 'Jan 05', remaining: 8, ideal: 12, completed: 12 },
    { date: 'Jan 06', remaining: 5, ideal: 10, completed: 15 },
    { date: 'Jan 07', remaining: 2, ideal: 8, completed: 18 },
  ];

  const mockWorkloadData = [
    { name: 'Alice Johnson', assigned: 12, completed: 8, inProgress: 3 },
    { name: 'Bob Smith', assigned: 10, completed: 7, inProgress: 2 },
    { name: 'Carol Davis', assigned: 8, completed: 6, inProgress: 1 },
    { name: 'David Wilson', assigned: 15, completed: 10, inProgress: 4 },
  ];

  const mockCompletionStats = {
    completed: 31,
    inProgress: 10,
    todo: 15,
    overdue: 4,
    totalTasks: 60,
    completionRate: 51.67,
  };

  const timeRanges = generateTimeRanges();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights into project progress, team performance, and task completion trends.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-48">
              <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range, index) => (
                    <SelectItem key={index} value={`range-${index}`}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-48">
              <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="frontend">Frontend Team</SelectItem>
                  <SelectItem value="backend">Backend Team</SelectItem>
                  <SelectItem value="design">Design Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated: Just now</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{mockCompletionStats.totalTasks}</p>
              </div>
              <div className="ml-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold text-green-600">{mockCompletionStats.completionRate}%</p>
              </div>
              <div className="ml-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-yellow-600">{mockCompletionStats.inProgress}</p>
              </div>
              <div className="ml-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-red-600">{mockCompletionStats.overdue}</p>
              </div>
              <div className="ml-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Burndown Chart */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Burndown Chart</h3>
              <p className="text-sm text-gray-600">Track project progress against ideal timeline</p>
            </div>
            <BurndownChart data={mockBurndownData} height={300} />
          </Card>

          {/* Team Workload Chart */}
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Team Workload</h3>
              <p className="text-sm text-gray-600">Compare workload distribution across team members</p>
            </div>
            <TeamWorkloadChart data={mockWorkloadData} height={300} />
          </Card>
        </div>

        {/* Task Completion Report */}
        <div className="mt-6">
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Task Completion Report</h3>
              <p className="text-sm text-gray-600">Detailed breakdown of task status and completion metrics</p>
            </div>
            <TaskCompletionReport stats={mockCompletionStats} height={250} />
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Key Insights</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Team is 15% ahead of ideal burndown schedule</li>
              <li>• Alice Johnson has the highest workload allocation</li>
              <li>• 4 tasks are currently overdue and need attention</li>
              <li>• Overall completion rate has improved by 12% this week</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Consider redistributing tasks to balance workload</li>
              <li>• Address overdue tasks with high priority</li>
              <li>• Maintain current velocity for on-time delivery</li>
              <li>• Schedule team sync for task blockers</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Export Report
              </button>
              <button className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Schedule Review
              </button>
              <button className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Details
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
