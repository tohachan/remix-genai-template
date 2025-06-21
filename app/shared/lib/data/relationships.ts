/**
 * Data Integration Layer - Entity Relationships
 * Defines comprehensive relationships between all entities and provides utilities for data consistency
 */

import type { User } from '~/entities/user';
import type { Team, TeamMember } from '~/entities/team';
import type { Project, ProjectWithRelations } from '~/entities/project';
import type { Task, TaskWithRelations } from '~/entities/task';

// Relationship Types
export interface EntityRelationships {
  user: {
    teams: Team[];
    ownedProjects: Project[];
    assignedTasks: Task[];
    createdTasks: Task[];
    teamMemberships: TeamMember[];
  };
  team: {
    members: TeamMember[];
    projects: Project[];
    tasks: Task[];
    admins: User[];
  };
  project: {
    owner: User;
    team?: Team;
    tasks: Task[];
    members: User[];
    completedTasks: Task[];
    overdueTasks: Task[];
  };
  task: {
    assignee?: User;
    creator: User;
    project: Project;
    dependencies: Task[];
    dependents: Task[];
    team?: Team;
  };
}

// Aggregated Data Types
export interface UserWithFullRelations extends User {
  teams: Team[];
  ownedProjects: ProjectWithRelations[];
  assignedTasks: TaskWithRelations[];
  createdTasks: TaskWithRelations[];
  teamMemberships: TeamMember[];
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
}

export interface TeamWithFullRelations extends Team {
  members: TeamMember[];
  projects: ProjectWithRelations[];
  tasks: TaskWithRelations[];
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    averageProgress: number;
  };
}

export interface ProjectWithFullRelations extends ProjectWithRelations {
  tasks: TaskWithRelations[];
  overdueTasks: TaskWithRelations[];
  members: User[];
  recentActivity: {
    type: 'task_created' | 'task_completed' | 'task_assigned' | 'project_updated';
    entityId: string;
    userId: string;
    timestamp: string;
    description: string;
  }[];
}

// Data Consistency Types
export interface DataIntegrityConstraints {
  // Foreign Key Constraints
  taskProjectExists: (projectId: string) => boolean;
  taskAssigneeExists: (userId: string) => boolean;
  projectOwnerExists: (userId: string) => boolean;
  projectTeamExists: (teamId: string) => boolean;
  teamMemberExists: (userId: string, teamId: string) => boolean;

  // Business Logic Constraints
  userCanAccessProject: (userId: string, projectId: string) => boolean;
  userCanModifyTask: (userId: string, taskId: string) => boolean;
  userCanManageTeam: (userId: string, teamId: string) => boolean;
  taskDependencyValid: (taskId: string, dependencyId: string) => boolean;
}

// Cache Invalidation Mapping
export interface CacheInvalidationMap {
  User: {
    invalidates: ('Team' | 'Project' | 'Task' | 'TeamMember')[];
    cascades: string[];
  };
  Team: {
    invalidates: ('User' | 'Project' | 'Task' | 'TeamMember')[];
    cascades: string[];
  };
  Project: {
    invalidates: ('User' | 'Team' | 'Task')[];
    cascades: string[];
  };
  Task: {
    invalidates: ('User' | 'Team' | 'Project')[];
    cascades: string[];
  };
  TeamMember: {
    invalidates: ('User' | 'Team' | 'Project' | 'Task')[];
    cascades: string[];
  };
}

// Default cache invalidation strategy
export const CACHE_INVALIDATION_STRATEGY: CacheInvalidationMap = {
  User: {
    invalidates: ['Team', 'Project', 'Task', 'TeamMember'],
    cascades: ['user-teams', 'user-projects', 'user-tasks'],
  },
  Team: {
    invalidates: ['User', 'Project', 'Task', 'TeamMember'],
    cascades: ['team-members', 'team-projects', 'team-tasks'],
  },
  Project: {
    invalidates: ['User', 'Team', 'Task'],
    cascades: ['project-tasks', 'project-members', 'project-stats'],
  },
  Task: {
    invalidates: ['User', 'Team', 'Project'],
    cascades: ['task-dependencies', 'project-stats', 'user-stats'],
  },
  TeamMember: {
    invalidates: ['User', 'Team', 'Project', 'Task'],
    cascades: ['team-members', 'user-teams', 'project-access'],
  },
};

// Entity Query Strategies
export interface EntityQueryStrategy {
  withRelations: boolean;
  cacheTime: number;
  staleTime: number;
  refetchOnWindowFocus: boolean;
  tags: string[];
}

export const ENTITY_QUERY_STRATEGIES: Record<string, EntityQueryStrategy> = {
  user: {
    withRelations: false,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    tags: ['User'],
  },
  userWithRelations: {
    withRelations: true,
    cacheTime: 3 * 60 * 1000, // 3 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    tags: ['User', 'Team', 'Project', 'Task'],
  },
  team: {
    withRelations: false,
    cacheTime: 10 * 60 * 1000, // 10 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    tags: ['Team'],
  },
  project: {
    withRelations: false,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    tags: ['Project'],
  },
  task: {
    withRelations: false,
    cacheTime: 2 * 60 * 1000, // 2 minutes
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    tags: ['Task'],
  },
};

// Data transformation utilities
export const transformData = {
  taskToWithRelations: (task: Task, users: User[], projects: Project[]): TaskWithRelations => {
    const assignee = task.assigneeId ? users.find(u => u.id === task.assigneeId) : undefined;
    const result: TaskWithRelations = {
      ...task,
      project: projects.find(p => p.id === task.projectId)!,
      dependencyTasks: [], // Would be populated by dependency resolution
      creator: users.find(u => u.id === task.createdBy)!,
    };
    if (assignee) {
      result.assignee = assignee;
    }
    return result;
  },

  projectToWithRelations: (project: Project, users: User[], teams: Team[]): ProjectWithRelations => {
    const team = project.teamId ? teams.find(t => t.id === project.teamId) : undefined;
    const result: ProjectWithRelations = {
      ...project,
      owner: users.find(u => u.id === project.ownerId)!,
      taskCount: 0, // Would be calculated from tasks
      completedTaskCount: 0, // Would be calculated from tasks
      memberCount: 0, // Would be calculated from team members
    };
    if (team) {
      result.team = team;
    }
    return result;
  },
};
