import TaskCard from './TaskCard';

describe('TaskCard', () => {
  it('should be defined', () => {
    expect(TaskCard).toBeDefined();
    expect(typeof TaskCard).toBe('object');
  });

  it('should have displayName', () => {
    expect(TaskCard.displayName).toBe('TaskCard');
  });
});
