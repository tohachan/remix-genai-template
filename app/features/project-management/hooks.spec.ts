import {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useProjectManagement,
} from './hooks';

describe('Project Management Hooks', () => {
  describe('useProjects', () => {
    it('should be defined', () => {
      expect(useProjects).toBeDefined();
      expect(typeof useProjects).toBe('function');
    });
  });

  describe('useProject', () => {
    it('should be defined', () => {
      expect(useProject).toBeDefined();
      expect(typeof useProject).toBe('function');
    });
  });

  describe('useCreateProject', () => {
    it('should be defined', () => {
      expect(useCreateProject).toBeDefined();
      expect(typeof useCreateProject).toBe('function');
    });
  });

  describe('useUpdateProject', () => {
    it('should be defined', () => {
      expect(useUpdateProject).toBeDefined();
      expect(typeof useUpdateProject).toBe('function');
    });
  });

  describe('useDeleteProject', () => {
    it('should be defined', () => {
      expect(useDeleteProject).toBeDefined();
      expect(typeof useDeleteProject).toBe('function');
    });
  });

  describe('useProjectManagement', () => {
    it('should be defined', () => {
      expect(useProjectManagement).toBeDefined();
      expect(typeof useProjectManagement).toBe('function');
    });
  });
});
