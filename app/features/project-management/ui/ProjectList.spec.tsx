import { ProjectList } from './ProjectList';

describe('ProjectList', () => {
  it('should be defined', () => {
    expect(ProjectList).toBeDefined();
    expect(typeof ProjectList).toBe('object');
  });

  it('should have displayName', () => {
    expect(ProjectList.displayName).toBe('ProjectList');
  });
});
