import * as React from 'react';
import { cn } from '~/shared/lib/utils';
import { useCreateProject, useUpdateProject } from '../hooks';
import { Button } from '~/shared/ui/button';
import { Card } from '~/shared/ui/card';
import { Input } from '~/shared/ui/input';
import { Label } from '~/shared/ui/label';
import { Textarea } from '~/shared/ui/textarea';
import { Select } from '~/shared/ui/select';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../api';

interface ProjectFormProps {
  className?: string;
  project?: Project;
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
}

const ProjectForm = React.forwardRef<
  HTMLFormElement,
  ProjectFormProps
>(({ className, project, onSuccess, onCancel, ...props }, ref) => {
  const { createProject, isLoading: isCreating, error: createError } = useCreateProject();
  const { updateProject, isLoading: isUpdating, error: updateError } = useUpdateProject();

  const isEditing = !!project;
  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  const [formData, setFormData] = React.useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'active' as const,
  });

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Project title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Project title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Project description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Project description must be at least 10 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && project) {
        const updates: UpdateProjectRequest = {};

        if (formData.title !== project.title) updates.title = formData.title;
        if (formData.description !== project.description) updates.description = formData.description;
        if (formData.status !== project.status) updates.status = formData.status;

        if (Object.keys(updates).length > 0) {
          const result = await updateProject(project.id, updates);
          onSuccess?.(result.data);
        } else {
          onCancel?.();
        }
      } else {
        const createData: CreateProjectRequest = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
        };
        const result = await createProject(createData);
        onSuccess?.(result.data);
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as Project['status'],
    }));
  };

  return (
    <Card className={cn('p-6', className)}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="space-y-6"
        {...props}
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </h2>
          <p className="text-sm text-gray-600">
            {isEditing
              ? 'Update the project details below.'
              : 'Fill in the details to create a new project.'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-600">
              {typeof error === 'object' && 'message' in error
                ? String(error.message)
                : 'An error occurred while saving the project'}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleInputChange('title')}
              className={cn(formErrors.title && 'border-red-300')}
              disabled={isLoading}
            />
            {formErrors.title && (
              <p className="text-sm text-red-600">{formErrors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleInputChange('description')}
              className={cn(
                'min-h-[100px]',
                formErrors.description && 'border-red-300',
              )}
              disabled={isLoading}
            />
            {formErrors.description && (
              <p className="text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update Project' : 'Create Project')}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
});

ProjectForm.displayName = 'ProjectForm';

export { ProjectForm };
