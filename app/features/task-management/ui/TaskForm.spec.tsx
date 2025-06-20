import TaskForm from './TaskForm';

describe('TaskForm', () => {
  it('should be defined', () => {
    expect(TaskForm).toBeDefined();
    expect(typeof TaskForm).toBe('object');
  });

  it('should have displayName', () => {
    expect(TaskForm.displayName).toBe('TaskForm');
  });
});
