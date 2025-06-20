// UI Components
export { ProjectList } from './ui/ProjectList';
export { ProjectForm } from './ui/ProjectForm';

// Hooks
export {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useProjectManagement,
} from './hooks';

// API
export { projectApi } from './api';
export type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsResponse,
  ProjectResponse,
} from './api';
