import type { MetaFunction } from '@remix-run/node';
import { ComponentDemo } from '~/shared/ui/ComponentDemo';
import { InteractiveDemo } from '~/shared/ui/InteractiveDemo';
import { DemoButton } from '~/shared/ui/DemoButton';

export const meta: MetaFunction = () => {
  return [
    { title: 'Dependency Injection - ProjectLearn Manager' },
    { name: 'description', content: 'Learn how to implement dependency injection patterns for loosely coupled and testable React applications.' },
  ];
};

export default function DependencyInjectionPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Dependency Injection</h1>

      <p>Dependency Injection (DI) is a design pattern that provides dependencies to a component from the outside rather than creating them internally, promoting loose coupling and easier testing.</p>

      <h2>The Problem</h2>

      <p>Without dependency injection, components create their own dependencies:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ❌ BAD: Hard dependencies
function UserProfile() {
  const api = new ApiClient(); // Hard dependency
  const logger = new Logger(); // Hard dependency
  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    api.getUser().then(user => {
      setUser(user);
      logger.log('User loaded', user.id);
    });
  }, []);
  
  return <div>{user?.name}</div>;
}`}</code>
      </pre>

      <p><strong>Problems:</strong></p>
      <ul>
        <li>Hard to test (can't mock dependencies)</li>
        <li>Tightly coupled to specific implementations</li>
        <li>Difficult to change behavior</li>
      </ul>

      <h2>React DI Patterns</h2>

      <h3>1. <strong>Props Injection</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ✅ GOOD: Dependencies injected via props
interface UserProfileProps {
  apiClient: ApiClient;
  logger: Logger;
}

function UserProfile({ apiClient, logger }: UserProfileProps) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    apiClient.getUser().then(user => {
      setUser(user);
      logger.log('User loaded', user.id);
    });
  }, [apiClient, logger]);
  
  return <div>{user?.name}</div>;
}

// Usage
<UserProfile 
  apiClient={new ApiClient()} 
  logger={new Logger()} 
/>`}</code>
      </pre>

      <h3>2. <strong>Context Injection</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ✅ GOOD: Dependencies via Context
const ServicesContext = createContext<{
  apiClient: ApiClient;
  logger: Logger;
} | null>(null);

function UserProfile() {
  const services = useContext(ServicesContext);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    services?.apiClient.getUser().then(user => {
      setUser(user);
      services?.logger.log('User loaded', user.id);
    });
  }, [services]);
  
  return <div>{user?.name}</div>;
}

// Provider setup
function App() {
  const services = {
    apiClient: new ApiClient(),
    logger: new Logger()
  };
  
  return (
    <ServicesContext.Provider value={services}>
      <UserProfile />
    </ServicesContext.Provider>
  );}`}</code>
      </pre>

      <h3>3. <strong>Hook Injection</strong></h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ✅ GOOD: Custom hooks as dependency injection
function useServices() {
  return useContext(ServicesContext);
}

function UserProfile() {
  const { apiClient, logger } = useServices();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    apiClient.getUser().then(user => {
      setUser(user);
      logger.log('User loaded', user.id);
    });
  }, [apiClient, logger]);
  
  return <div>{user?.name}</div>;
}`}</code>
      </pre>

      <h2>Testing Benefits</h2>

      <p>With dependency injection, testing becomes much easier:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// Easy to test with mocked dependencies
describe('UserProfile', () => {
  it('loads and displays user', async () => {
    const mockApi = {
      getUser: jest.fn().mockResolvedValue({ name: 'John' })
    };
    const mockLogger = {
      log: jest.fn()
    };
    
    render(
      <UserProfile 
        apiClient={mockApi} 
        logger={mockLogger} 
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
    
    expect(mockApi.getUser).toHaveBeenCalled();
    expect(mockLogger.log).toHaveBeenCalledWith('User loaded', expect.any(String));
  });
});`}</code>
      </pre>

      <h2>Our DI Implementation</h2>

      <p>ProjectLearn Manager uses a combination of Context and custom hooks:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// app/shared/lib/providers/services-provider.tsx
const ServicesContext = createContext<Services | null>(null);

interface Services {
  apiClient: ApiClient;
  logger: Logger;
  analytics: Analytics;
}

export function ServicesProvider({ children }: { children: ReactNode }) {
  const services: Services = {
    apiClient: new ApiClient(process.env.API_URL),
    logger: new Logger(process.env.NODE_ENV),
    analytics: new Analytics(process.env.ANALYTICS_KEY)
  };
  
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return context;
}`}</code>
      </pre>

      <h2>Live DI Examples</h2>

      <p>Here are interactive examples demonstrating dependency injection patterns:</p>

      <h3>Good vs Bad: Component Dependencies</h3>

      <ComponentDemo
        title="Props-Based Dependency Injection"
        description="This button demonstrates how dependencies can be injected via props, making it testable and flexible"
        code={`// Component with injected dependencies
function ConfigurableButton({ 
  onClick = () => console.log('clicked'),
  theme = 'primary' 
}) {
  return <DemoButton variant={theme} onClick={onClick}>
    Injected Button
  </DemoButton>;
}`}
      >
        <DemoButton
          variant="primary"
          onClick={() => alert('Dependency injected click handler!')}
        >
          Injected Button
        </DemoButton>
      </ComponentDemo>

      <h3>Interactive DI Pattern Demo</h3>

      <InteractiveDemo
        title="Dependency Injection Playground"
        description="Experiment with different injection strategies for the same component"
        controls={[
          {
            name: 'injectionType',
            type: 'select',
            options: ['props', 'context', 'hook'],
            defaultValue: 'props',
          },
          {
            name: 'buttonText',
            type: 'text',
            defaultValue: 'DI Demo',
          },
          {
            name: 'variant',
            type: 'select',
            options: ['primary', 'secondary', 'outline'],
            defaultValue: 'primary',
          },
        ]}
      >
        {(props) => (
          <div className="space-y-4">
            <DemoButton
              variant={props.variant}
              onClick={() => alert(`Injection type: ${props.injectionType}`)}
            >
              {props.buttonText}
            </DemoButton>
            <div className="text-sm text-gray-600">
              Current injection method: <strong>{props.injectionType}</strong>
            </div>
          </div>
        )}
      </InteractiveDemo>

      <h2>Cursor Rules Integration</h2>

      <p>Our project enforces proper DI patterns through Cursor Rules:</p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Rule: require-di-pattern</strong><br/>
              Automatically detects direct service imports and suggests using DI hooks instead:
            </p>
            <ul className="mt-2 text-sm text-blue-600">
              <li>❌ <code>import apiClient from 'services/api'</code></li>
              <li>✅ <code>const apiClient = useApiClient()</code></li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Benefits of Dependency Injection</h2>

      <ul>
        <li><strong>Enhanced Testability</strong>: Easy to mock services in unit tests</li>
        <li><strong>Runtime Flexibility</strong>: Switch implementations without code changes</li>
        <li><strong>Loose Coupling</strong>: Components depend on abstractions, not concrete classes</li>
        <li><strong>Better Separation of Concerns</strong>: Clear boundaries between UI and business logic</li>
        <li><strong>Improved Maintainability</strong>: Centralized service management and easier refactoring</li>
      </ul>

      <p>Dependency injection makes our React applications more testable, flexible, and maintainable by removing hard dependencies and enabling easy substitution of implementations.</p>
    </div>
  );
}
