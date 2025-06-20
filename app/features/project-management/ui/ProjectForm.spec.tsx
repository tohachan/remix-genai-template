import { ProjectForm } from './ProjectForm';

describe('ProjectForm', () => {
  it('should be defined', () => {
    expect(ProjectForm).toBeDefined();
    expect(typeof ProjectForm).toBe('object');
  });

  it('should have displayName', () => {
    expect(ProjectForm.displayName).toBe('ProjectForm');
  });
});
