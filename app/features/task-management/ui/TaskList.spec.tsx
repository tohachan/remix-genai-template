import TaskList from './TaskList';

describe('TaskList', () => {
  it('should be defined', () => {
    expect(TaskList).toBeDefined();
    expect(typeof TaskList).toBe('object');
  });

  it('should have displayName', () => {
    expect(TaskList.displayName).toBe('TaskList');
  });
});
