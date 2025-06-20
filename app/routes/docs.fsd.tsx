import type { MetaFunction } from '@remix-run/node';
import { ComponentDemo } from '~/shared/ui/ComponentDemo';
import TaskCard from '~/features/task-management/ui/TaskCard';
import { Button } from '~/shared/ui/button';

export const meta: MetaFunction = () => {
  return [
    { title: 'Feature-Sliced Design - ProjectLearn Manager' },
    { name: 'description', content: 'Understanding Feature-Sliced Design (FSD) methodology for building scalable and maintainable frontend applications.' },
  ];
};

export default function FSDPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 prose prose-lg">
      <h1>Feature-Sliced Design (FSD)</h1>

      <p>Feature-Sliced Design is an architectural methodology for building frontend applications that promotes scalability, maintainability, and team collaboration.</p>

      <h2>Core Principles</h2>

      <h3>1. <strong>Layered Architecture</strong></h3>
      <p>FSD organizes code into hierarchical layers with strict import rules:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`app/                    ← Application layer
├── pages/             ← Application pages
├── widgets/           ← Large UI chunks
├── features/          ← Business features  
├── entities/          ← Business entities
└── shared/            ← Reusable infrastructure`}</code>
      </pre>

      <h3>2. <strong>Slice-Based Organization</strong></h3>
      <p>Within each layer (except shared), code is organized into slices by business domain:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`features/
├── authentication/    ← Auth feature slice
├── user-profile/      ← Profile feature slice
└── task-management/   ← Task feature slice`}</code>
      </pre>

      <h3>3. <strong>Segment Structure</strong></h3>
      <p>Each slice contains segments that group code by technical purpose:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`features/authentication/
├── ui/               ← React components
├── api/              ← API requests
├── model/            ← Business logic, stores
├── lib/              ← Slice-specific utilities
└── config/           ← Configuration`}</code>
      </pre>

      <h2>ProjectLearn Manager FSD Structure</h2>

      <p>Our application follows FSD methodology:</p>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`app/
├── pages/                     ← Page-level components
│   ├── home/
│   │   ├── ui/index.tsx
│   │   └── README.md
│   └── docs/
│       ├── ui/index.tsx
│       └── README.md
│
├── widgets/                   ← Large UI blocks
│   └── navigation/
│       ├── ui/
│       └── README.md
│
├── features/                  ← Business features
│   ├── task-management/
│   │   ├── ui/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── TaskCard.tsx
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── README.md
│   │
│   ├── project-management/
│   │   ├── ui/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── README.md
│   │
│   └── kanban-board/
│       ├── ui/
│       ├── api.ts
│       ├── hooks.ts
│       └── README.md
│
├── entities/                  ← Business entities
│   ├── task/
│   │   ├── model/types.ts
│   │   └── index.ts
│   └── user/
│       ├── model/types.ts
│       └── index.ts
│
└── shared/                    ← Shared infrastructure
    ├── ui/                    ← Reusable components
    │   ├── button.tsx
    │   ├── card.tsx
    │   └── form.tsx
    ├── lib/                   ← Utilities
    │   ├── utils.ts
    │   └── api/
    └── config/                ← App configuration
        └── theme.ts`}</code>
      </pre>

      <h2>Import Rules</h2>

      <p>FSD enforces strict import rules to maintain architectural boundaries:</p>

      <h3>✅ <strong>Allowed Imports</strong></h3>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// Pages can import from all lower layers
// app/pages/dashboard/ui/index.tsx
import { TaskBoard } from '~/widgets/task-board';      // widgets
import { CreateTask } from '~/features/task-management'; // features
import { Task } from '~/entities/task';                 // entities
import { Button } from '~/shared/ui/button';            // shared

// Features can import from entities and shared
// app/features/task-management/ui/TaskForm.tsx
import { Task } from '~/entities/task';         // entities
import { Button } from '~/shared/ui/button';    // shared
import { api } from '~/shared/lib/api';         // shared

// Entities can only import from shared
// app/entities/task/model/types.ts
import { BaseEntity } from '~/shared/lib/types'; // shared`}</code>
      </pre>

      <h3>❌ <strong>Forbidden Imports</strong></h3>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// ❌ Features cannot import from pages or widgets
// app/features/task-management/ui/TaskForm.tsx
import { DashboardPage } from '~/pages/dashboard'; // ❌ Higher layer

// ❌ Entities cannot import from features
// app/entities/task/model/types.ts  
import { TaskForm } from '~/features/task-management'; // ❌ Higher layer

// ❌ Slices cannot import from other slices on same layer
// app/features/task-management/ui/TaskForm.tsx
import { UserProfile } from '~/features/user-profile'; // ❌ Same layer`}</code>
      </pre>

      <h2>Practical Example: Task Management Feature</h2>

      <p>Let's examine how our task management feature follows FSD:</p>

      <h3>Entity Layer: Task Types</h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// app/entities/task/model/types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  assignee?: string;
  projectId: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: Task['priority'];
  deadline?: Date;
  projectId: string;
}`}</code>
      </pre>

      <h3>Feature Layer: Task Management</h3>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// app/features/task-management/api.ts
import { api } from '~/shared/lib/api';
import { Task, CreateTaskData } from '~/entities/task';

export const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
    }),
    createTask: builder.mutation<Task, CreateTaskData>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
    }),
  }),
});`}</code>
      </pre>

      <h2>Benefits of FSD</h2>

      <ul>
        <li><strong>Predictable Structure</strong>: Consistent organization across all features</li>
        <li><strong>Scalability</strong>: Easy to add new features without architectural changes</li>
        <li><strong>Team Collaboration</strong>: Clear boundaries reduce merge conflicts</li>
        <li><strong>Maintainability</strong>: Easy to locate and modify specific functionality</li>
        <li><strong>Testing</strong>: Clear separation enables focused testing strategies</li>
      </ul>

      <h2>Live FSD Examples</h2>

      <p>Here are actual components from our project demonstrating FSD layers in action:</p>

      <h3>Shared Layer: Reusable UI Components</h3>

      <ComponentDemo
        title="Shared Button Component"
        description="A reusable button from the shared layer that can be used across all features"
        code={`<Button variant="default" size="sm">
  Shared Button
</Button>`}
      >
        <Button variant="default" size="sm">
          Shared Button
        </Button>
      </ComponentDemo>

      <h3>Feature Layer: Business Logic Components</h3>

      <ComponentDemo
        title="TaskCard Component"
        description="A feature-layer component that encapsulates task display logic and integrates with the task entity"
        code={`<TaskCard 
  task={{
    id: '1',
    title: 'Implement FSD Architecture',
    description: 'Set up Feature-Sliced Design structure for better code organization',
    status: 'completed',
    priority: 'high',
    deadline: '2025-01-10',
    assignee: 'Development Team'
  }}
/>`}
      >
        <TaskCard
          task={{
            id: '1',
            title: 'Implement FSD Architecture',
            description: 'Set up Feature-Sliced Design structure for better code organization',
            status: 'done',
            priority: 'high',
            deadline: '2025-01-10',
            assignee: 'Development Team',
            projectId: 'proj-docs',
            dependencies: [],
            createdAt: '2025-01-08',
            updatedAt: '2025-01-10',
          }}
        />
      </ComponentDemo>

      <h2>Integration with Other Patterns</h2>

      <p>FSD works well with other architectural patterns:</p>

      <ul>
        <li><strong>Dependency Injection</strong>: Services injected through context providers</li>
        <li><strong>Single Responsibility Principle</strong>: Each slice and segment has focused purpose</li>
        <li><strong>Design Tokens</strong>: Centralized in shared layer configuration</li>
        <li><strong>Testing Strategies</strong>: Clear boundaries enable targeted testing</li>
      </ul>

      <p>FSD provides a solid foundation for building scalable React applications by enforcing clear architectural boundaries and promoting good separation of concerns.</p>
    </div>
  );
}
