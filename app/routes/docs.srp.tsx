import type { MetaFunction } from '@remix-run/node';
import { DemoButton } from '~/shared/ui/DemoButton';
import { ComponentDemo } from '~/shared/ui/ComponentDemo';
import { InteractiveDemo } from '~/shared/ui/InteractiveDemo';
import TaskCard from '~/features/task-management/ui/TaskCard';

export const meta: MetaFunction = () => {
  return [
    { title: 'Single Responsibility Principle - ProjectLearn Manager' },
    { name: 'description', content: 'Learn how the Single Responsibility Principle (SRP) creates maintainable and focused components in React applications.' },
  ];
};

export default function SRPPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Single Responsibility Principle (SRP)</h1>

      <p>The Single Responsibility Principle states that <strong>a class should have only one reason to change</strong>, meaning it should have only one job or responsibility.</p>

      <h2>What is SRP?</h2>

      <p>In React applications, SRP means that each component should:</p>
      <ul>
        <li>Have a single, well-defined purpose</li>
        <li>Be responsible for only one aspect of functionality</li>
        <li>Have only one reason to change</li>
      </ul>

      <h2>Before: Violating SRP</h2>

      <p>Here's an example of a component that violates SRP by handling multiple responsibilities:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ❌ BAD: This component has too many responsibilities
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Responsibility 1: User data fetching
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  // Responsibility 2: Posts data fetching
  useEffect(() => {
    fetchUserPosts().then(setPosts);
  }, []);

  // Responsibility 3: Notifications handling
  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  // Responsibility 4: Form validation
  const validateEmail = (email) => {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  };

  // Responsibility 5: Data formatting
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US').format(new Date(date));
  };

  return (
    <div>
      {/* Complex UI mixing user info, posts, and notifications */}
      <h1>Welcome, {user?.name}</h1>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{formatDate(post.createdAt)}</p>
          </div>
        ))}
      </div>
      <div>
        {notifications.map(notif => (
          <div key={notif.id}>{notif.message}</div>
        ))}
      </div>
    </div>
  );
}`}</code>
      </pre>

      <p><strong>Problems with this approach:</strong></p>
      <ul>
        <li>Hard to test individual pieces</li>
        <li>Changes to one feature affect the entire component</li>
        <li>Difficult to reuse parts of the functionality</li>
        <li>Complex component with multiple concerns</li>
      </ul>

      <h2>After: Following SRP</h2>

      <p>Here's how we can refactor this into focused, single-responsibility components:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ✅ GOOD: User info component with single responsibility
function UserInfo({ user }) {
  if (!user) return <div>Loading user...</div>;
  
  return (
    <header>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>
    </header>
  );
}

// ✅ GOOD: Posts list component with single responsibility
function PostsList({ posts }) {
  if (!posts.length) return <div>No posts found</div>;

  return (
    <section>
      <h2>Your Posts</h2>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}

// ✅ GOOD: Container component orchestrating others
function UserDashboard() {
  const { user, posts, notifications, isLoading } = useUserDashboard();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <UserInfo user={user} />
      <PostsList posts={posts} />
      <NotificationsList notifications={notifications} />
    </div>
  );
}`}</code>
      </pre>

      <h2>Benefits of Following SRP</h2>

      <h3>1. Easier Testing</h3>
      <p>Each component can be tested in isolation:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`describe('UserInfo', () => {
  it('displays user name and email', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserInfo user={user} />);
    
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});`}</code>
      </pre>

      <h3>2. Better Reusability</h3>
      <p>Components can be reused across different parts of the application.</p>

      <h3>3. Simpler Maintenance</h3>
      <p>Changes to one aspect don't affect others:</p>
      <ul>
        <li>Notification styling changes only affect <code>NotificationsList</code></li>
        <li>User data structure changes only affect <code>UserInfo</code></li>
        <li>Post formatting changes only affect <code>PostCard</code></li>
      </ul>

      <h2>Key Takeaways</h2>

      <ol>
        <li><strong>One Responsibility</strong>: Each component should have a single, clear purpose</li>
        <li><strong>Easier Testing</strong>: Focused components are easier to test in isolation</li>
        <li><strong>Better Reusability</strong>: Single-purpose components can be reused more easily</li>
        <li><strong>Simpler Maintenance</strong>: Changes are localized to specific components</li>
        <li><strong>Clear APIs</strong>: Components with single responsibilities have cleaner interfaces</li>
      </ol>

      <p>By following SRP, you create a codebase that's more maintainable, testable, and flexible for future changes.</p>

      <h2>Live Component Examples</h2>

      <p>Here are some real components from our project that demonstrate SRP in action:</p>

      <h3>Single-Purpose Button Component</h3>

      <ComponentDemo
        title="DemoButton Component"
        description="A focused button component with clear variant and size responsibilities"
        code={`<DemoButton variant="primary" size="md">
  Primary Button
</DemoButton>

<DemoButton variant="secondary" size="lg">
  Secondary Button
</DemoButton>

<DemoButton variant="outline" size="sm">
  Outline Button
</DemoButton>`}
      >
        <div className="flex gap-4 items-center">
          <DemoButton variant="primary" size="md">
            Primary Button
          </DemoButton>
          <DemoButton variant="secondary" size="lg">
            Secondary Button
          </DemoButton>
          <DemoButton variant="outline" size="sm">
            Outline Button
          </DemoButton>
        </div>
      </ComponentDemo>

      <h3>Task Management Components</h3>

      <p>These components each have a single, focused responsibility within the task management feature:</p>

      <ComponentDemo
        title="TaskCard Component"
        description="A focused component that only handles displaying a single task's information"
        code={`<TaskCard 
  task={{
    id: '1',
    title: 'Implement SRP Documentation',
    description: 'Add live component examples to demonstrate SRP principles',
    status: 'in-progress',
    priority: 'high',
    deadline: '2025-01-15',
    assignee: 'John Doe'
  }}
/>`}
      >
        <TaskCard
          task={{
            id: '1',
            title: 'Implement SRP Documentation',
            description: 'Add live component examples to demonstrate SRP principles',
            status: 'in-progress',
            priority: 'high',
            deadline: '2025-01-15',
            assignee: 'John Doe',
            projectId: 'proj-1',
            dependencies: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-10T15:30:00Z',
          }}
        />
      </ComponentDemo>

      <h3>Interactive Button Playground</h3>

      <p>Try modifying the button properties below to see how a single-responsibility component can be flexible while maintaining its focused purpose:</p>

      <InteractiveDemo
        title="Interactive DemoButton"
        description="Experiment with different button configurations to see SRP in action"
        controls={[
          {
            name: 'children',
            type: 'text',
            defaultValue: 'Click me!',
          },
          {
            name: 'variant',
            type: 'select',
            options: ['primary', 'secondary', 'outline'],
            defaultValue: 'primary',
          },
          {
            name: 'size',
            type: 'select',
            options: ['sm', 'md', 'lg'],
            defaultValue: 'md',
          },
          {
            name: 'disabled',
            type: 'boolean',
            defaultValue: false,
          },
        ]}
      >
        {(props) => (
          <DemoButton
            variant={props.variant}
            size={props.size}
            disabled={props.disabled}
          >
            {props.children || 'Button'}
          </DemoButton>
        )}
      </InteractiveDemo>

      <p>This interactive example demonstrates how the <code>DemoButton</code> component maintains its single responsibility (rendering a button) while being flexible enough to handle different visual presentations and states through well-defined props.</p>

      <p>These live examples show how each component has a single, well-defined responsibility:</p>
      <ul>
        <li><strong>DemoButton</strong>: Only handles button rendering with variant and size concerns</li>
        <li><strong>TaskCard</strong>: Only handles displaying a single task's information</li>
        <li><strong>ComponentDemo</strong>: Only handles wrapping and displaying component examples</li>
      </ul>

      <p>Each component can be developed, tested, and maintained independently while working together to create the complete user experience.</p>
    </div>
  );
}
