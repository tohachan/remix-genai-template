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

// All handlers combined
export const handlers = [...projectHandlers, ...taskHandlers];
