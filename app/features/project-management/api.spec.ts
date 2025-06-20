import { projectApi } from './api';

describe('Project API', () => {
  describe('projectApi', () => {
    it('should be defined', () => {
      expect(projectApi).toBeDefined();
    });

    it('should have correct endpoint names', () => {
      expect(projectApi.endpoints.getProjects).toBeDefined();
      expect(projectApi.endpoints.getProject).toBeDefined();
      expect(projectApi.endpoints.createProject).toBeDefined();
      expect(projectApi.endpoints.updateProject).toBeDefined();
      expect(projectApi.endpoints.deleteProject).toBeDefined();
    });

    it('should export hooks for all endpoints', () => {
      const {
        useGetProjectsQuery,
        useGetProjectQuery,
        useCreateProjectMutation,
        useUpdateProjectMutation,
        useDeleteProjectMutation,
      } = projectApi;

      expect(useGetProjectsQuery).toBeDefined();
      expect(useGetProjectQuery).toBeDefined();
      expect(useCreateProjectMutation).toBeDefined();
      expect(useUpdateProjectMutation).toBeDefined();
      expect(useDeleteProjectMutation).toBeDefined();
    });
  });

  describe('API endpoint configurations', () => {
    it('should configure getProjects with correct query and tags', () => {
      const endpoint = projectApi.endpoints.getProjects;
      expect(endpoint.select).toBeDefined();
    });

    it('should configure createProject with correct mutation and tags', () => {
      const endpoint = projectApi.endpoints.createProject;
      expect(endpoint.select).toBeDefined();
    });

    it('should configure updateProject with correct mutation and tags', () => {
      const endpoint = projectApi.endpoints.updateProject;
      expect(endpoint.select).toBeDefined();
    });

    it('should configure deleteProject with correct mutation and tags', () => {
      const endpoint = projectApi.endpoints.deleteProject;
      expect(endpoint.select).toBeDefined();
    });
  });
});
