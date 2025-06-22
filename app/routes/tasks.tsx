import type { MetaFunction } from '@remix-run/node';
import { TaskList } from '~/features/task-management';
import { ProtectedRoute } from '~/shared/ui/ProtectedRoute';

export const meta: MetaFunction = () => {
  return [
    { title: 'Tasks - Task Management' },
    { name: 'description', content: 'Manage your tasks and track progress' },
  ];
};

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tasks
          </h1>
          <p className="text-gray-600">
            Manage your tasks and track progress
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <TaskList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
