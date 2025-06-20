import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Layered Separation - ProjectLearn Manager' },
    { name: 'description', content: 'Learn how to implement proper layered architecture and separation of concerns in React applications.' },
  ];
};

export default function LayeredSeparationPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Layered Separation</h1>

      <p>Layered separation is an architectural pattern that organizes code into distinct layers, each with specific responsibilities and clear boundaries.</p>

      <h2>The Problem</h2>

      <p>Without proper layered separation, applications often become:</p>
      <ul>
        <li>Difficult to test</li>
        <li>Hard to maintain</li>
        <li>Tightly coupled</li>
        <li>Prone to circular dependencies</li>
      </ul>

      <h2>Our Layer Structure</h2>

      <p>ProjectLearn Manager follows a clear layered architecture:</p>

      <h3>1. <strong>Presentation Layer (UI)</strong></h3>
      <ul>
        <li>React components</li>
        <li>User interaction handling</li>
        <li>UI state management</li>
      </ul>

      <h3>2. <strong>Business Logic Layer (Hooks)</strong></h3>
      <ul>
        <li>Application business rules</li>
        <li>Data orchestration</li>
        <li>State management</li>
      </ul>

      <h3>3. <strong>Data Access Layer (API)</strong></h3>
      <ul>
        <li>External service communication</li>
        <li>Data fetching and mutations</li>
        <li>Caching logic</li>
      </ul>

      <h3>4. <strong>Infrastructure Layer (Shared)</strong></h3>
      <ul>
        <li>Utilities and helpers</li>
        <li>Configuration</li>
        <li>Third-party integrations</li>
      </ul>

      <h2>Example: Task Management</h2>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ❌ BAD: Mixed concerns
function TaskList() {
  const [tasks, setTasks] = useState([]);
  
  // Data fetching mixed with UI
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);
  
  // Business logic in UI component
  const completedTasks = tasks.filter(t => t.status === 'done');
  const progress = (completedTasks.length / tasks.length) * 100;
  
  return (
    <div>
      <h2>Tasks ({progress.toFixed(1)}% complete)</h2>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => {
            // API call in UI component
            fetch(\`/api/tasks/\${task.id}\`, {
              method: 'PATCH',
              body: JSON.stringify({ status: 'done' })
            });
          }}>
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}`}</code>
      </pre>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ✅ GOOD: Separated layers

// Data Layer
export const taskApi = {
  getTasks: () => fetch('/api/tasks').then(res => res.json()),
  updateTask: (id, data) => 
    fetch(\`/api/tasks/\${id}\`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
};

// Business Logic Layer  
export const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  
  const loadTasks = useCallback(async () => {
    const data = await taskApi.getTasks();
    setTasks(data);
  }, []);
  
  const completeTask = useCallback(async (taskId) => {
    await taskApi.updateTask(taskId, { status: 'done' });
    loadTasks(); // Refresh data
  }, [loadTasks]);
  
  const completedTasks = useMemo(
    () => tasks.filter(t => t.status === 'done'),
    [tasks]
  );
  
  const progress = useMemo(
    () => tasks.length ? (completedTasks.length / tasks.length) * 100 : 0,
    [completedTasks.length, tasks.length]
  );
  
  return { tasks, progress, completeTask, loadTasks };
};

// Presentation Layer
export function TaskList() {
  const { tasks, progress, completeTask } = useTaskManagement();
  
  return (
    <div>
      <h2>Tasks ({progress.toFixed(1)}% complete)</h2>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onComplete={() => completeTask(task.id)}
        />
      ))}
    </div>
  );
}

function TaskCard({ task, onComplete }) {
  return (
    <div>
      <h3>{task.title}</h3>
      <button onClick={onComplete}>Complete</button>
    </div>
  );
}`}</code>
      </pre>

      <h2>Benefits</h2>

      <ol>
        <li><strong>Testability</strong>: Each layer can be tested independently</li>
        <li><strong>Maintainability</strong>: Changes are isolated to specific layers</li>
        <li><strong>Reusability</strong>: Business logic can be reused across components</li>
        <li><strong>Separation of Concerns</strong>: Each layer has a single responsibility</li>
      </ol>

      <p>Proper layered separation creates more maintainable and scalable applications.</p>
    </div>
  );
}
