/**
 * ProjectManagement Feature Hooks
 * React hooks specific to project-management feature
 */
import { useState } from 'react';
import {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from './api';
import type { CreateProjectRequest, UpdateProjectRequest, Project } from './api';

/**
 * Hook for managing projects list with state management
 */
export function useProjects() {
  const { data, isLoading, error, refetch } = useGetProjectsQuery();

  return {
    projects: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for managing single project data
 */
export function useProject(id: string) {
  const { data, isLoading, error, refetch } = useGetProjectQuery(id, {
    skip: !id,
  });

  return {
    project: data?.data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for project creation with state management
 */
export function useCreateProject() {
  const [createProject, { isLoading, error }] = useCreateProjectMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateProject = async(projectData: CreateProjectRequest) => {
    try {
      setIsSuccess(false);
      const result = await createProject(projectData).unwrap();
      setIsSuccess(true);
      return result;
    } catch (err) {
      setIsSuccess(false);
      throw err;
    }
  };

  return {
    createProject: handleCreateProject,
    isLoading,
    error,
    isSuccess,
  };
}

/**
 * Hook for project updates with optimistic updates
 */
export function useUpdateProject() {
  const [updateProject, { isLoading, error }] = useUpdateProjectMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdateProject = async(id: string, updates: UpdateProjectRequest) => {
    try {
      setIsSuccess(false);
      const result = await updateProject({ id, body: updates }).unwrap();
      setIsSuccess(true);
      return result;
    } catch (err) {
      setIsSuccess(false);
      throw err;
    }
  };

  return {
    updateProject: handleUpdateProject,
    isLoading,
    error,
    isSuccess,
  };
}

/**
 * Hook for project deletion with confirmation
 */
export function useDeleteProject() {
  const [deleteProject, { isLoading, error }] = useDeleteProjectMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDeleteProject = async(id: string) => {
    try {
      setIsSuccess(false);
      await deleteProject(id).unwrap();
      setIsSuccess(true);
    } catch (err) {
      setIsSuccess(false);
      throw err;
    }
  };

  return {
    deleteProject: handleDeleteProject,
    isLoading,
    error,
    isSuccess,
  };
}

/**
 * Combined hook for all project operations
 */
export function useProjectManagement() {
  const projectsHook = useProjects();
  const createHook = useCreateProject();
  const updateHook = useUpdateProject();
  const deleteHook = useDeleteProject();

  return {
    // Projects list
    ...projectsHook,

    // Operations
    createProject: createHook.createProject,
    updateProject: updateHook.updateProject,
    deleteProject: deleteHook.deleteProject,

    // Loading states
    isCreating: createHook.isLoading,
    isUpdating: updateHook.isLoading,
    isDeleting: deleteHook.isLoading,

    // Success states
    createSuccess: createHook.isSuccess,
    updateSuccess: updateHook.isSuccess,
    deleteSuccess: deleteHook.isSuccess,

    // Errors
    createError: createHook.error,
    updateError: updateHook.error,
    deleteError: deleteHook.error,
  };
}
