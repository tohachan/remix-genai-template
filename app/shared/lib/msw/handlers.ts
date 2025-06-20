import { http, HttpResponse } from 'msw';

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  deadline?: string;
  projectId: string;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data storage
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete redesign of the company website',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Develop a new mobile application',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    description: 'Create wireframes and designs for the homepage',
    status: 'in-progress',
    priority: 'high',
    assignee: 'John Doe',
    deadline: '2024-02-15T00:00:00Z',
    projectId: '1',
    dependencies: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '2',
    title: 'Implement Navigation',
    description: 'Build responsive navigation component',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    deadline: '2024-02-20T00:00:00Z',
    projectId: '1',
    dependencies: ['1'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Setup Development Environment',
    description: 'Configure React Native development environment',
    status: 'done',
    priority: 'high',
    assignee: 'Bob Johnson',
    deadline: '2024-01-30T00:00:00Z',
    projectId: '2',
    dependencies: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  {
    id: '4',
    title: 'Create API Documentation',
    description: 'Write comprehensive API documentation',
    status: 'todo',
    priority: 'medium',
    assignee: 'Alice Brown',
    deadline: '2024-03-15T00:00:00Z',
    projectId: '1',
    dependencies: [],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Implement User Authentication',
    description: 'Add login and registration functionality',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Charlie Davis',
    deadline: '2024-02-28T00:00:00Z',
    projectId: '2',
    dependencies: ['3'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '6',
    title: 'Design User Interface',
    description: 'Create mockups and prototypes for mobile app',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Diana Miller',
    deadline: '2024-03-01T00:00:00Z',
    projectId: '2',
    dependencies: [],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Test Website Performance',
    description: 'Run performance tests and optimize',
    status: 'todo',
    priority: 'low',
    assignee: 'Eve Wilson',
    deadline: '2024-03-20T00:00:00Z',
    projectId: '1',
    dependencies: ['1', '2'],
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
];

// Utility functions
const generateId = (): string => Math.random().toString(36).substr(2, 9);
const getCurrentTimestamp = (): string => new Date().toISOString();

// Project handlers
export const projectHandlers = [
  // GET /api/projects
  http.get('/api/projects', () => {
    return HttpResponse.json({
      data: mockProjects,
      total: mockProjects.length,
    });
  }),

  // GET /api/projects/:id
  http.get('/api/projects/:id', ({ params }) => {
    const { id } = params;
    const project = mockProjects.find(p => p.id === id);

    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ data: project });
  }),

  // POST /api/projects
  http.post('/api/projects', async({ request }) => {
    const body = await request.json() as Pick<Project, 'title' | 'description' | 'status'>;
    const newProject: Project = {
      id: generateId(),
      title: body.title,
      description: body.description,
      status: body.status,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockProjects.push(newProject);

    return HttpResponse.json({ data: newProject }, { status: 201 });
  }),

  // PUT /api/projects/:id
  http.put('/api/projects/:id', async({ request, params }) => {
    const { id } = params;
    const body = await request.json() as Partial<Pick<Project, 'title' | 'description' | 'status'>>;
    const projectIndex = mockProjects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const existingProject = mockProjects[projectIndex];
    if (existingProject) {
      if (body.title !== undefined) existingProject.title = body.title;
      if (body.description !== undefined) existingProject.description = body.description;
      if (body.status !== undefined) existingProject.status = body.status;
      existingProject.updatedAt = getCurrentTimestamp();
    }

    return HttpResponse.json({ data: existingProject });
  }),

  // DELETE /api/projects/:id
  http.delete('/api/projects/:id', ({ params }) => {
    const { id } = params;
    const projectIndex = mockProjects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockProjects.splice(projectIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];

// Task handlers
export const taskHandlers = [
  // GET /api/tasks
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    let filteredTasks = mockTasks;
    if (projectId) {
      filteredTasks = mockTasks.filter(task => task.projectId === projectId);
    }

    return HttpResponse.json({
      data: filteredTasks,
      total: filteredTasks.length,
    });
  }),

  // GET /api/tasks/:id
  http.get('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const task = mockTasks.find(t => t.id === id);

    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ data: task });
  }),

  // POST /api/tasks
  http.post('/api/tasks', async({ request }) => {
    const body = await request.json() as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
    const newTask: Task = {
      id: generateId(),
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      projectId: body.projectId,
      dependencies: body.dependencies,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      // Only include optional properties if they have values
      ...(body.assignee && { assignee: body.assignee }),
      ...(body.deadline && { deadline: body.deadline }),
    };

    mockTasks.push(newTask);

    return HttpResponse.json({ data: newTask }, { status: 201 });
  }),

  // PUT /api/tasks/:id
  http.put('/api/tasks/:id', async({ request, params }) => {
    const { id } = params;
    const body = await request.json() as Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
    const taskIndex = mockTasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const existingTask = mockTasks[taskIndex];
    if (existingTask) {
      if (body.title !== undefined) existingTask.title = body.title;
      if (body.description !== undefined) existingTask.description = body.description;
      if (body.status !== undefined) existingTask.status = body.status;
      if (body.priority !== undefined) existingTask.priority = body.priority;
      if (body.projectId !== undefined) existingTask.projectId = body.projectId;
      if (body.dependencies !== undefined) existingTask.dependencies = body.dependencies;
      // Handle optional properties properly
      if (body.assignee !== undefined) {
        if (body.assignee) {
          existingTask.assignee = body.assignee;
        } else {
          delete existingTask.assignee;
        }
      }
      if (body.deadline !== undefined) {
        if (body.deadline) {
          existingTask.deadline = body.deadline;
        } else {
          delete existingTask.deadline;
        }
      }
      existingTask.updatedAt = getCurrentTimestamp();
    }

    return HttpResponse.json({ data: existingTask });
  }),

  // DELETE /api/tasks/:id
  http.delete('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const taskIndex = mockTasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockTasks.splice(taskIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];

// Calendar handlers for calendar-specific endpoints
export const calendarHandlers = [
  // GET /api/calendar/events
  http.get('/api/calendar/events', ({ request }) => {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    let filteredTasks = mockTasks.filter(task => task.deadline);

    if (projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredTasks = filteredTasks.filter(task => {
        if (!task.deadline) return false;
        const taskDate = new Date(task.deadline);
        return taskDate >= start && taskDate <= end;
      });
    }

    // Transform tasks to calendar events
    const events = filteredTasks.map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.deadline as string),
      end: new Date(task.deadline as string),
      resource: task,
    }));

    return HttpResponse.json({
      events,
      total: events.length,
    });
  }),

  // PATCH /api/calendar/tasks/:id/deadline
  http.patch('/api/calendar/tasks/:id/deadline', async({ request, params }) => {
    const { id } = params;
    const body = await request.json() as { deadline: string };
    const taskIndex = mockTasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const existingTask = mockTasks[taskIndex];
    if (existingTask) {
      existingTask.deadline = body.deadline;
      existingTask.updatedAt = getCurrentTimestamp();
    }

    return HttpResponse.json({
      task: existingTask,
      success: true,
      message: 'Task deadline updated successfully',
    });
  }),
];

// All handlers combined
export const handlers = [...projectHandlers, ...taskHandlers, ...calendarHandlers];
