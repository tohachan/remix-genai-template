import type { MetaFunction } from '@remix-run/node';
import { ProjectList } from '~/features/project-management/ui/ProjectList';
import { ProtectedRoute } from '~/shared/ui/ProtectedRoute';

export const meta: MetaFunction = () => {
  return [
    { title: 'Projects - Project Management' },
    { name: 'description', content: 'Manage your projects and track progress' },
  ];
};

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Projects
          </h1>
          <p className="text-gray-600">
            Manage your projects and track progress
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <ProjectList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
