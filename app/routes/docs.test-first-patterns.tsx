import type { MetaFunction } from '@remix-run/node';
import { ComponentDemo } from '~/shared/ui/ComponentDemo';
import { DemoButton } from '~/shared/ui/DemoButton';
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Test-First Patterns - ProjectLearn Manager' },
    { name: 'description', content: 'Learn how to implement test-driven development and testing best practices in React applications.' },
  ];
};

export default function TestFirstPatternsPage() {
  const [testResults, setTestResults] = useState<Array<{test: string, status: 'pass' | 'fail'}>>([]);

  const runDemo = (testName: string, shouldPass: boolean) => {
    setTestResults(prev => [...prev, { test: testName, status: shouldPass ? 'pass' : 'fail' }]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Test-First Patterns</h1>

      <p>Test-first development writes tests before implementation, ensuring better design decisions and comprehensive coverage.</p>

      <h2>The Test-First Approach</h2>

      <p>Instead of writing tests after implementation, we write tests first:</p>

      <ol>
        <li><strong>Write the test</strong> - Define expected behavior</li>
        <li><strong>Run the test</strong> - Watch it fail (red)</li>
        <li><strong>Write minimal code</strong> - Make the test pass (green)</li>
        <li><strong>Refactor</strong> - Improve code while keeping tests green</li>
      </ol>

      <h2>Example: Task Creation Feature</h2>

      <h3>1. Write the Test First</h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// app/features/task-management/ui/TaskForm.spec.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('creates a new task when form is submitted', async () => {
    const mockOnCreate = jest.fn();
    
    render(<TaskForm onCreateTask={mockOnCreate} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Task' }
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Task description' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    // Verify the callback was called with correct data
    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description'
      });
    });
  });
});`}</code>
      </pre>

      <h3>2. Implement the Component</h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// app/features/task-management/ui/TaskForm.tsx
import { useState } from 'react';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';

interface TaskFormProps {
  onCreateTask: (task: { title: string; description: string }) => void;
}

export function TaskForm({ onCreateTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTask({ title, description });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        aria-label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        aria-label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit">Create</Button>
    </form>
  );
}`}</code>
      </pre>

      <h2>Testing Patterns in Our Project</h2>

      <h3>1. <strong>Component Testing</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// Test component behavior, not implementation
describe('TaskCard', () => {
  it('displays task information', () => {
    const task = { id: '1', title: 'Test Task', status: 'todo' };
    render(<TaskCard task={task} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('todo')).toBeInTheDocument();
  });
});`}</code>
      </pre>

      <h3>2. <strong>Hook Testing</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// Test custom hooks with renderHook
import { renderHook, act } from '@testing-library/react';
import { useTasks } from './hooks';

describe('useTasks', () => {
  it('loads tasks on mount', async () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.tasks).toHaveLength(2);
    });
  });
});`}</code>
      </pre>

      <h3>3. <strong>API Testing</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// Test API layer with MSW
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { taskApi } from './api';

const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json([
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' }
    ]));
  })
);

describe('taskApi', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  
  it('fetches tasks successfully', async () => {
    const result = await taskApi.endpoints.getTasks.initiate();
    expect(result.data).toHaveLength(2);
  });
});`}</code>
      </pre>

      <h2>Interactive Testing Demo</h2>

      <ComponentDemo
        title="Test-First Development Simulation"
        description="Simulate running tests in a TDD workflow"
        code={`// Simulate TDD cycle: Red -> Green -> Refactor
const runTest = (testName, shouldPass) => {
  console.log(\`Running: \${testName}\`);
  return shouldPass ? 'PASS' : 'FAIL';
};`}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <DemoButton
              variant="outline"
              size="sm"
              onClick={() => runDemo('Component renders correctly', true)}
            >
              Run Component Test
            </DemoButton>
            <DemoButton
              variant="outline"
              size="sm"
              onClick={() => runDemo('Form validation works', true)}
            >
              Run Hook Test
            </DemoButton>
            <DemoButton
              variant="outline"
              size="sm"
              onClick={() => runDemo('API call succeeds', false)}
            >
              Run API Test (Fail)
            </DemoButton>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Test Results:</h4>
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 text-sm rounded ${
                    result.status === 'pass'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {result.status === 'pass' ? '✅' : '❌'} {result.test}
                </div>
              ))}
            </div>
          )}
        </div>
      </ComponentDemo>

      <h2>Test Organization</h2>

      <p>Our project follows this testing structure:</p>

      <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg">
        <code>{`app/features/task-management/
├── ui/
│   ├── TaskForm.tsx
│   ├── TaskForm.spec.tsx       # Component tests
│   ├── TaskList.tsx
│   └── TaskList.spec.tsx
├── api.ts
├── api.spec.ts                 # API tests
├── hooks.ts
└── hooks.spec.ts               # Hook tests`}</code>
      </pre>

      <h2>Testing Best Practices</h2>

      <h3>1. <strong>Test Behavior, Not Implementation</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ❌ BAD: Testing implementation details
expect(component.state.count).toBe(1);

// ✅ GOOD: Testing user-visible behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();`}</code>
      </pre>

      <h3>2. <strong>Use Meaningful Test Names</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ❌ BAD: Vague test name
it('works correctly', () => {});

// ✅ GOOD: Descriptive test name
it('displays error message when API call fails', () => {});`}</code>
      </pre>

      <h3>3. <strong>Arrange-Act-Assert Pattern</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`it('creates task when form is submitted', () => {
  // Arrange
  const mockOnCreate = jest.fn();
  render(<TaskForm onCreateTask={mockOnCreate} />);
  
  // Act
  fireEvent.click(screen.getByRole('button', { name: /create/i }));
  
  // Assert
  expect(mockOnCreate).toHaveBeenCalled();
});`}</code>
      </pre>

      <h2>Benefits of Test-First Development</h2>

      <ul>
        <li><strong>Better Design</strong>: Writing tests first forces you to think about the API</li>
        <li><strong>Complete Coverage</strong>: Every feature has tests from the start</li>
        <li><strong>Faster Debugging</strong>: Tests catch regressions immediately</li>
        <li><strong>Documentation</strong>: Tests serve as living documentation</li>
        <li><strong>Confidence</strong>: Refactoring becomes safer with comprehensive tests</li>
      </ul>

      <p>Test-first patterns ensure our code is reliable, maintainable, and well-designed from the beginning.</p>
    </div>
  );
}
