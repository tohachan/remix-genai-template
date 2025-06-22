import { http, HttpResponse } from 'msw';
import { theme } from '~/shared/design-system/theme';
import type { User, UserRole } from '~/entities/user';
import type { Task } from '~/entities/task';
import type { Project } from '~/entities/project';
import type {
  Team,
  TeamMember,
  TeamInvitation,
  CreateTeamData,
  UpdateTeamData,
  InviteMemberData,
  UpdateMemberRoleData,
  TeamRole,
  TeamStats,
  TeamWithMembers,
} from '~/entities/team';

// Mock data storage
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete redesign of the company website',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    progress: 0.65,
    ownerId: '1',
    teamId: '1',
    createdBy: '1',
    isArchived: false,
    tags: ['redesign', 'frontend'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Develop a new mobile application',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-02',
    endDate: '2024-08-01',
    progress: 0.25,
    ownerId: '1',
    teamId: '2',
    createdBy: '1',
    isArchived: false,
    tags: ['mobile', 'development'],
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
    assigneeId: '2',
    createdBy: '1',
    deadline: '2024-02-15T00:00:00Z',
    projectId: '1',
    dependencies: [],
    tags: ['design', 'frontend'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '2',
    title: 'Implement Navigation',
    description: 'Build responsive navigation component',
    status: 'todo',
    priority: 'medium',
    assigneeId: '3',
    createdBy: '1',
    deadline: '2024-02-20T00:00:00Z',
    projectId: '1',
    dependencies: ['1'],
    tags: ['frontend', 'components'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Setup Development Environment',
    description: 'Configure React Native development environment',
    status: 'done',
    priority: 'high',
    assigneeId: '4',
    createdBy: '1',
    deadline: '2024-01-30T00:00:00Z',
    projectId: '2',
    dependencies: [],
    tags: ['setup', 'environment'],
    completedAt: '2024-01-25T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  {
    id: '4',
    title: 'Create API Documentation',
    description: 'Write comprehensive API documentation',
    status: 'todo',
    priority: 'medium',
    assigneeId: '5',
    createdBy: '1',
    deadline: '2024-03-15T00:00:00Z',
    projectId: '1',
    dependencies: [],
    tags: ['documentation', 'api'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Implement User Authentication',
    description: 'Add login and registration functionality',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '2',
    createdBy: '1',
    deadline: '2024-02-28T00:00:00Z',
    projectId: '2',
    dependencies: ['3'],
    tags: ['auth', 'security'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '6',
    title: 'Design User Interface',
    description: 'Create mockups and prototypes for mobile app',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: '3',
    createdBy: '1',
    deadline: '2024-03-01T00:00:00Z',
    projectId: '2',
    dependencies: [],
    tags: ['design', 'ui'],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Test Website Performance',
    description: 'Run performance tests and optimize',
    status: 'todo',
    priority: 'low',
    assigneeId: '4',
    createdBy: '1',
    deadline: '2024-03-20T00:00:00Z',
    projectId: '1',
    dependencies: ['1', '2'],
    tags: ['testing', 'performance'],
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
];

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=admin',
    isAuthenticated: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=john',
    isAuthenticated: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=jane',
    isAuthenticated: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=bob',
    isAuthenticated: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=alice',
    isAuthenticated: false,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

// Mock teams data
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Design Team',
    description: 'Frontend design and UX team',
    color: theme.colors.primary[500],
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: '1',
    memberCount: 3,
  },
  {
    id: '2',
    name: 'Development Team',
    description: 'Backend and frontend development team',
    color: theme.colors.success[500],
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=dev',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    createdBy: '1',
    memberCount: 4,
  },
];

// Mock team members data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    teamId: '1',
    userId: '1',
    role: 'admin',
    joinedAt: '2024-01-01T00:00:00Z',
    invitedBy: '1',
    user: mockUsers.find(u => u.id === '1')!,
  },
  {
    id: '2',
    teamId: '1',
    userId: '2',
    role: 'member',
    joinedAt: '2024-01-02T00:00:00Z',
    invitedBy: '1',
    user: mockUsers.find(u => u.id === '2')!,
  },
  {
    id: '3',
    teamId: '1',
    userId: '3',
    role: 'member',
    joinedAt: '2024-01-03T00:00:00Z',
    invitedBy: '1',
    user: mockUsers.find(u => u.id === '3')!,
  },
  {
    id: '4',
    teamId: '2',
    userId: '1',
    role: 'admin',
    joinedAt: '2024-01-02T00:00:00Z',
    invitedBy: '1',
    user: mockUsers.find(u => u.id === '1')!,
  },
  {
    id: '5',
    teamId: '2',
    userId: '4',
    role: 'member',
    joinedAt: '2024-01-03T00:00:00Z',
    invitedBy: '1',
    user: mockUsers.find(u => u.id === '4')!,
  },
  {
    id: '6',
    teamId: '2',
    userId: '5',
    role: 'member',
    joinedAt: '2024-01-04T00:00:00Z',
    invitedBy: '1',
    user: mockUsers.find(u => u.id === '5')!,
  },
];

// Mock team invitations data
const mockTeamInvitations: TeamInvitation[] = [
  {
    id: '1',
    teamId: '1',
    email: 'newmember@example.com',
    role: 'member',
    status: 'pending',
    invitedBy: '1',
    createdAt: '2024-01-10T00:00:00Z',
    expiresAt: '2024-01-17T00:00:00Z',
    token: 'invite_token_123',
  },
];

// Mock session storage
let currentSession: {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: number;
} | null = null;

// Initialize session from localStorage if available
const initializeSession = () => {
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Create a mock session to match the stored token
        currentSession = {
          userId: user.id,
          token: storedToken,
          refreshToken: localStorage.getItem('auth_refresh_token') || '',
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        };
      } catch {
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_refresh_token');
      }
    }
  }
};

// Initialize session on module load
initializeSession();

// Utility functions
const generateId = (): string => Math.random().toString(36).substr(2, 9);
const getCurrentTimestamp = (): string => new Date().toISOString();
const generateToken = (): string => `mock_jwt_${Math.random().toString(36).substr(2, 20)}`;
const generateRefreshToken = (): string => `refresh_${Math.random().toString(36).substr(2, 20)}`;

// JWT Mock Utilities
const createSession = (user: User) => {
  const token = generateToken();
  const refreshToken = generateRefreshToken();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  currentSession = {
    userId: user.id,
    token,
    refreshToken,
    expiresAt,
  };

  return {
    user: { ...user, isAuthenticated: true },
    token,
    refreshToken,
    expiresIn: 24 * 60 * 60, // 24 hours in seconds
  };
};

const validateToken = (authorization: string | null): User | null => {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }

  const token = authorization.substring(7);

  if (!currentSession || currentSession.token !== token) {
    return null;
  }

  if (Date.now() > currentSession.expiresAt) {
    currentSession = null;
    return null;
  }

  const user = mockUsers.find(u => u.id === currentSession!.userId);
  return user ? { ...user, isAuthenticated: true } : null;
};

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
      priority: 'medium',
      startDate: new Date().toISOString().split('T')[0]!,
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!, // 90 days from now
      progress: 0,
      ownerId: '1', // Default to admin user for now
      teamId: '1', // Default to first team
      createdBy: '1',
      isArchived: false,
      tags: [],
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
      dependencies: body.dependencies || [],
      createdBy: '1', // Default to admin user for now
      tags: body.tags || [],
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      // Only include optional properties if they have values
      ...(body.assigneeId && { assigneeId: body.assigneeId }),
      ...(body.deadline && { deadline: body.deadline }),
      ...(body.status === 'done' && body.completedAt && { completedAt: body.completedAt }),
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
      if (body.assigneeId !== undefined) {
        if (body.assigneeId) {
          existingTask.assigneeId = body.assigneeId;
        } else {
          delete existingTask.assigneeId;
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

// Authentication handlers
export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async({ request }) => {
    const body = await request.json() as { email: string; password: string };

    const user = mockUsers.find(u => u.email === body.email);

    if (!user) {
      return HttpResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // For demo purposes, accept any password except 'wrong'
    if (body.password === 'wrong') {
      return HttpResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const session = createSession(user);

    return HttpResponse.json(session);
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', ({ request }) => {
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    currentSession = null;

    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  }),

  // POST /api/auth/refresh
  http.post('/api/auth/refresh', async({ request }) => {
    const body = await request.json() as { refreshToken: string };

    if (!currentSession || currentSession.refreshToken !== body.refreshToken) {
      return HttpResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 },
      );
    }

    const user = mockUsers.find(u => u.id === currentSession!.userId);

    if (!user) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    // Generate new tokens
    const token = generateToken();
    const refreshToken = generateRefreshToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    currentSession = {
      userId: user.id,
      token,
      refreshToken,
      expiresAt,
    };

    return HttpResponse.json({
      token,
      refreshToken,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
    });
  }),

  // GET /api/auth/me
  http.get('/api/auth/me', ({ request }) => {
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ user });
  }),

  // POST /api/auth/register
  http.post('/api/auth/register', async({ request }) => {
    const body = await request.json() as {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    };

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === body.email);
    if (existingUser) {
      return HttpResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 },
      );
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      name: body.name,
      email: body.email,
      role: body.role || 'member',
      avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${body.name}`,
      isAuthenticated: false,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockUsers.push(newUser);

    // Create session for new user
    const session = createSession(newUser);

    return HttpResponse.json(session, { status: 201 });
  }),

  // PUT /api/auth/user/:id
  http.put('/api/auth/user/:id', async({ request, params }) => {
    const { id } = params;
    const authorization = request.headers.get('authorization');
    const currentUser = validateToken(authorization);

    if (!currentUser) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Users can only update their own profile, or admins can update any
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return HttpResponse.json(
        { error: 'Forbidden' },
        { status: 403 },
      );
    }

    const body = await request.json() as {
      name?: string;
      email?: string;
      avatar?: string;
    };

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    const user = mockUsers[userIndex];
    if (user) {
      if (body.name !== undefined) user.name = body.name;
      if (body.email !== undefined) user.email = body.email;
      if (body.avatar !== undefined) user.avatar = body.avatar;
      user.updatedAt = getCurrentTimestamp();
    }

    return HttpResponse.json({
      user,
      success: true,
      message: 'User updated successfully',
    });
  }),

  // POST /api/auth/change-password
  http.post('/api/auth/change-password', async({ request }) => {
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json() as {
      currentPassword: string;
      newPassword: string;
    };

    // For demo purposes, just validate that currentPassword is not 'wrong'
    if (body.currentPassword === 'wrong') {
      return HttpResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 },
      );
    }

    // In a real app, you would hash and store the new password
    return HttpResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  }),
];

// Team helper functions
const calculateTeamStats = (teamId: string): TeamStats => {
  const members = mockTeamMembers.filter(m => m.teamId === teamId);
  const invitations = mockTeamInvitations.filter(i => i.teamId === teamId && i.status === 'pending');

  return {
    totalMembers: members.length,
    activeMembers: members.length,
    pendingInvitations: invitations.length,
    adminCount: members.filter(m => m.role === 'admin').length,
    memberCount: members.filter(m => m.role === 'member').length,
  };
};

const getTeamWithMembers = (team: Team): TeamWithMembers => {
  const members = mockTeamMembers.filter(m => m.teamId === team.id);
  const stats = calculateTeamStats(team.id);

  return {
    ...team,
    members,
    stats,
  };
};

// Team handlers
const teamHandlers = [
  // GET /api/teams
  http.get('/api/teams', ({ request }) => {
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const isActive = url.searchParams.get('isActive');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const filteredTeams = mockTeams.filter(team => {
      if (search && !team.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (isActive !== null && team.isActive !== (isActive === 'true')) {
        return false;
      }
      return true;
    });

    const total = filteredTeams.length;
    const offset = (page - 1) * limit;
    const paginatedTeams = filteredTeams.slice(offset, offset + limit);

    const teamsWithMembers = paginatedTeams.map(getTeamWithMembers);

    return HttpResponse.json({
      teams: teamsWithMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }),

  // GET /api/teams/:id
  http.get('/api/teams/:id', ({ request, params }) => {
    const { id } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const team = mockTeams.find(t => t.id === id);
    if (!team) {
      return HttpResponse.json(
        { error: 'Team not found' },
        { status: 404 },
      );
    }

    const teamWithMembers = getTeamWithMembers(team);

    return HttpResponse.json({ team: teamWithMembers });
  }),

  // POST /api/teams
  http.post('/api/teams', async({ request }) => {
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await request.json() as CreateTeamData;

    const newTeam: Team = {
      id: generateId(),
      name: body.name,
      description: body.description,
      color: body.color,
      avatar: body.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${body.name}`,
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      createdBy: user.id,
      memberCount: 1,
    };

    mockTeams.push(newTeam);

    // Add creator as admin member
    const newMember: TeamMember = {
      id: generateId(),
      teamId: newTeam.id,
      userId: user.id,
      role: 'admin',
      joinedAt: getCurrentTimestamp(),
      invitedBy: user.id,
      user,
    };

    mockTeamMembers.push(newMember);

    const teamWithMembers = getTeamWithMembers(newTeam);

    return HttpResponse.json({ team: teamWithMembers }, { status: 201 });
  }),

  // PUT /api/teams/:id
  http.put('/api/teams/:id', async({ request, params }) => {
    const { id } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const teamIndex = mockTeams.findIndex(t => t.id === id);
    if (teamIndex === -1) {
      return HttpResponse.json(
        { error: 'Team not found' },
        { status: 404 },
      );
    }

    // Check if user is admin of the team
    const userMembership = mockTeamMembers.find(m => m.teamId === id && m.userId === user.id);
    if (!userMembership || userMembership.role !== 'admin') {
      return HttpResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 },
      );
    }

    const body = await request.json() as UpdateTeamData;
    const team = mockTeams[teamIndex];

    if (team) {
      if (body.name !== undefined) team.name = body.name;
      if (body.description !== undefined) team.description = body.description;
      if (body.color !== undefined) team.color = body.color;
      if (body.avatar !== undefined) team.avatar = body.avatar;
      if (body.isActive !== undefined) team.isActive = body.isActive;
      team.updatedAt = getCurrentTimestamp();
    }

    const teamWithMembers = getTeamWithMembers(team!);

    return HttpResponse.json({ team: teamWithMembers });
  }),

  // DELETE /api/teams/:id
  http.delete('/api/teams/:id', ({ request, params }) => {
    const { id } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const teamIndex = mockTeams.findIndex(t => t.id === id);
    if (teamIndex === -1) {
      return HttpResponse.json(
        { error: 'Team not found' },
        { status: 404 },
      );
    }

    // Check if user is admin of the team
    const userMembership = mockTeamMembers.find(m => m.teamId === id && m.userId === user.id);
    if (!userMembership || userMembership.role !== 'admin') {
      return HttpResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 },
      );
    }

    // Remove team, members, and invitations
    mockTeams.splice(teamIndex, 1);
    const memberIndicesToRemove = mockTeamMembers
      .map((member, index) => (member.teamId === id ? index : -1))
      .filter(index => index !== -1)
      .reverse();

    memberIndicesToRemove.forEach(index => mockTeamMembers.splice(index, 1));

    const invitationIndicesToRemove = mockTeamInvitations
      .map((invitation, index) => (invitation.teamId === id ? index : -1))
      .filter(index => index !== -1)
      .reverse();

    invitationIndicesToRemove.forEach(index => mockTeamInvitations.splice(index, 1));

    return HttpResponse.json({ success: true });
  }),

  // GET /api/teams/:id/members
  http.get('/api/teams/:id/members', ({ request, params }) => {
    const { id } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const role = url.searchParams.get('role') as TeamRole | null;
    const search = url.searchParams.get('search') || '';

    let members = mockTeamMembers.filter(m => m.teamId === id);

    if (role) {
      members = members.filter(m => m.role === role);
    }

    if (search) {
      members = members.filter(m =>
        m.user.name.toLowerCase().includes(search.toLowerCase()) ||
        m.user.email.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return HttpResponse.json({ members });
  }),

  // POST /api/teams/:id/invite
  http.post('/api/teams/:id/invite', async({ request, params }) => {
    const { id } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const team = mockTeams.find(t => t.id === id);
    if (!team) {
      return HttpResponse.json(
        { error: 'Team not found' },
        { status: 404 },
      );
    }

    // Check if user is admin of the team
    const userMembership = mockTeamMembers.find(m => m.teamId === id && m.userId === user.id);
    if (!userMembership || userMembership.role !== 'admin') {
      return HttpResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 },
      );
    }

    const body = await request.json() as InviteMemberData;

    // Check if user is already a member
    const existingMember = mockTeamMembers.find(m => m.teamId === id && m.user.email === body.email);
    if (existingMember) {
      return HttpResponse.json(
        { error: 'User is already a member of this team' },
        { status: 409 },
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = mockTeamInvitations.find(
      i => i.teamId === id && i.email === body.email && i.status === 'pending',
    );
    if (existingInvitation) {
      return HttpResponse.json(
        { error: 'Invitation already sent to this email' },
        { status: 409 },
      );
    }

    const newInvitation: TeamInvitation = {
      id: generateId(),
      teamId: Array.isArray(id) ? id[0] : id || '',
      email: body.email,
      role: body.role,
      status: 'pending',
      invitedBy: user.id,
      createdAt: getCurrentTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      token: `invite_${generateId()}_${Date.now()}`,
    };

    mockTeamInvitations.push(newInvitation);

    return HttpResponse.json({ invitation: newInvitation }, { status: 201 });
  }),

  // PUT /api/teams/:teamId/members/:memberId/role
  http.put('/api/teams/:teamId/members/:memberId/role', async({ request, params }) => {
    const { teamId, memberId } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user || !teamId || !memberId) {
      return HttpResponse.json(
        { error: 'Unauthorized or invalid parameters' },
        { status: 401 },
      );
    }

    // Check if user is admin of the team
    const userMembership = mockTeamMembers.find(m => m.teamId === teamId && m.userId === user.id);
    if (!userMembership || userMembership.role !== 'admin') {
      return HttpResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 },
      );
    }

    const memberIndex = mockTeamMembers.findIndex(m => m.id === memberId && m.teamId === teamId);
    if (memberIndex === -1) {
      return HttpResponse.json(
        { error: 'Team member not found' },
        { status: 404 },
      );
    }

    const body = await request.json() as { role: TeamRole };
    const member = mockTeamMembers[memberIndex];
    if (member) {
      member.role = body.role;
    }

    return HttpResponse.json({ member: mockTeamMembers[memberIndex] });
  }),

  // DELETE /api/teams/:teamId/members/:memberId
  http.delete('/api/teams/:teamId/members/:memberId', ({ request, params }) => {
    const { teamId, memberId } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const memberIndex = mockTeamMembers.findIndex(m => m.id === memberId && m.teamId === teamId);
    if (memberIndex === -1) {
      return HttpResponse.json(
        { error: 'Team member not found' },
        { status: 404 },
      );
    }

    const member = mockTeamMembers[memberIndex];
    if (!member) {
      return HttpResponse.json(
        { error: 'Team member not found' },
        { status: 404 },
      );
    }

    // Check if user is admin of the team or removing themselves
    const userMembership = mockTeamMembers.find(m => m.teamId === teamId && m.userId === user.id);
    if (!userMembership || (userMembership.role !== 'admin' && member.userId !== user.id)) {
      return HttpResponse.json(
        { error: 'Forbidden' },
        { status: 403 },
      );
    }

    // Don't allow removing the last admin
    if (member.role === 'admin') {
      const adminCount = mockTeamMembers.filter(m => m.teamId === teamId && m.role === 'admin').length;
      if (adminCount === 1) {
        return HttpResponse.json(
          { error: 'Cannot remove the last admin from the team' },
          { status: 400 },
        );
      }
    }

    mockTeamMembers.splice(memberIndex, 1);

    // Update team member count
    const team = mockTeams.find(t => t.id === teamId);
    if (team) {
      team.memberCount = mockTeamMembers.filter(m => m.teamId === teamId).length;
      team.updatedAt = getCurrentTimestamp();
    }

    return HttpResponse.json({ success: true });
  }),

  // GET /api/teams/:id/invitations
  http.get('/api/teams/:id/invitations', ({ request, params }) => {
    const { id } = params;
    const authorization = request.headers.get('authorization');
    const user = validateToken(authorization);

    if (!user) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // Check if user is admin of the team
    const userMembership = mockTeamMembers.find(m => m.teamId === id && m.userId === user.id);
    if (!userMembership || userMembership.role !== 'admin') {
      return HttpResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 },
      );
    }

    const invitations = mockTeamInvitations.filter(i => i.teamId === id);

    return HttpResponse.json({ invitations });
  }),
];

// All handlers combined
export const handlers = [...projectHandlers, ...taskHandlers, ...calendarHandlers, ...authHandlers, ...teamHandlers];
