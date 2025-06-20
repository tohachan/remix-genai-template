import * as React from 'react';
import { cn } from '~/shared/lib/utils';
import { useProjects, useDeleteProject } from '../hooks';
import { Button } from '~/shared/ui/button';
import { Card } from '~/shared/ui/card';
import type { Project } from '../api';

interface ProjectListProps {
  className?: string;
  onProjectSelect?: (project: Project) => void;
  onProjectEdit?: (project: Project) => void;
}

const ProjectList = React.forwardRef<
  HTMLDivElement,
  ProjectListProps
>(({ className, onProjectSelect, onProjectEdit, ...props }, ref) => {
  const { projects, isLoading, error, refetch } = useProjects();
  const { deleteProject, isLoading: isDeleting } = useDeleteProject();

  const handleDeleteProject = async(id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        await refetch();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center p-8', className)}
        {...props}
      >
        <div className="text-center">
          <div className="text-lg font-medium">Loading projects...</div>
          <div className="text-sm text-gray-500 mt-2">Please wait while we fetch your projects.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center p-8', className)}
        {...props}
      >
        <div className="text-center">
          <div className="text-lg font-medium text-red-600">Error loading projects</div>
          <div className="text-sm text-gray-500 mt-2">
            {error && typeof error === 'object' && 'message' in error
              ? String(error.message)
              : 'An unexpected error occurred'}
          </div>
          <Button
            onClick={() => refetch()}
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center p-8', className)}
        {...props}
      >
        <div className="text-center">
          <div className="text-lg font-medium">No projects found</div>
          <div className="text-sm text-gray-500 mt-2">Create your first project to get started.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn('space-y-4', className)}
      {...props}
    >
      {projects.map((project) => (
        <Card key={project.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className="text-lg font-semibold truncate cursor-pointer hover:text-blue-600"
                  onClick={() => onProjectSelect?.(project)}
                >
                  {project.title}
                </h3>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(project.status),
                )}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {project.description || 'No description provided'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onProjectEdit?.(project)}
                disabled={isDeleting}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteProject(project.id)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});

ProjectList.displayName = 'ProjectList';

export { ProjectList };
