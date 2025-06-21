/**
 * Data Consistency Validation
 * Provides utilities for ensuring referential integrity and business logic constraints
 */

import type { User } from '~/entities/user';
import type { Team, TeamMember } from '~/entities/team';
import type { Project } from '~/entities/project';
import type { Task } from '~/entities/task';

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Base validation utilities
export const createValidationError = (field: string, message: string, code: string): ValidationError => ({
  field,
  message,
  code,
});

export const createValidationResult = (errors: ValidationError[]): ValidationResult => ({
  isValid: errors.length === 0,
  errors,
});

// Entity existence validators
export const validateEntityExists = {
  user: (userId: string, users: User[]): ValidationError | null => {
    const user = users.find(u => u.id === userId);
    return user
      ? null
      : createValidationError('userId', `User with ID ${userId} does not exist`, 'USER_NOT_FOUND');
  },

  team: (teamId: string, teams: Team[]): ValidationError | null => {
    const team = teams.find(t => t.id === teamId);
    return team
      ? null
      : createValidationError('teamId', `Team with ID ${teamId} does not exist`, 'TEAM_NOT_FOUND');
  },

  project: (projectId: string, projects: Project[]): ValidationError | null => {
    const project = projects.find(p => p.id === projectId);
    return project
      ? null
      : createValidationError('projectId', `Project with ID ${projectId} does not exist`, 'PROJECT_NOT_FOUND');
  },

  task: (taskId: string, tasks: Task[]): ValidationError | null => {
    const task = tasks.find(t => t.id === taskId);
    return task
      ? null
      : createValidationError('taskId', `Task with ID ${taskId} does not exist`, 'TASK_NOT_FOUND');
  },
};

// Business logic validators
export const validateBusinessRules = {
  userCanAccessProject: (userId: string, project: Project, teams: Team[], teamMembers: TeamMember[]): ValidationError | null => {
    // Owner always has access
    if (project.ownerId === userId) return null;

    // Team member has access if project belongs to their team
    if (project.teamId) {
      const membership = teamMembers.find(m => m.userId === userId && m.teamId === project.teamId);
      if (membership) return null;
    }

    return createValidationError(
      'access',
      'User does not have access to this project',
      'ACCESS_DENIED',
    );
  },

  userCanModifyTask: (userId: string, task: Task, project: Project, teams: Team[], teamMembers: TeamMember[]): ValidationError | null => {
    // Creator or assignee can modify
    if (task.createdBy === userId || task.assigneeId === userId) return null;

    // Project owner can modify
    if (project.ownerId === userId) return null;

    // Team admin can modify if project belongs to their team
    if (project.teamId) {
      const membership = teamMembers.find(m =>
        m.userId === userId &&
        m.teamId === project.teamId &&
        m.role === 'admin',
      );
      if (membership) return null;
    }

    return createValidationError(
      'modification',
      'User does not have permission to modify this task',
      'MODIFICATION_DENIED',
    );
  },

  userCanManageTeam: (userId: string, teamId: string, teamMembers: TeamMember[]): ValidationError | null => {
    const membership = teamMembers.find(m => m.userId === userId && m.teamId === teamId);

    if (!membership) {
      return createValidationError(
        'teamManagement',
        'User is not a member of this team',
        'NOT_TEAM_MEMBER',
      );
    }

    if (membership.role !== 'admin') {
      return createValidationError(
        'teamManagement',
        'User must be a team admin to manage this team',
        'INSUFFICIENT_PERMISSIONS',
      );
    }

    return null;
  },

  taskDependencyValid: (taskId: string, dependencyId: string, tasks: Task[]): ValidationError | null => {
    // Cannot depend on itself
    if (taskId === dependencyId) {
      return createValidationError(
        'dependencies',
        'Task cannot depend on itself',
        'CIRCULAR_DEPENDENCY',
      );
    }

    const task = tasks.find(t => t.id === taskId);
    const dependency = tasks.find(t => t.id === dependencyId);

    if (!task || !dependency) {
      return createValidationError(
        'dependencies',
        'Invalid task or dependency reference',
        'INVALID_REFERENCE',
      );
    }

    // Tasks must be in the same project
    if (task.projectId !== dependency.projectId) {
      return createValidationError(
        'dependencies',
        'Task dependencies must be within the same project',
        'CROSS_PROJECT_DEPENDENCY',
      );
    }

    // Check for circular dependencies
    const hasCircularDependency = (currentTaskId: string, targetTaskId: string, visited = new Set<string>()): boolean => {
      if (visited.has(currentTaskId)) return true;
      visited.add(currentTaskId);

      const currentTask = tasks.find(t => t.id === currentTaskId);
      if (!currentTask) return false;

      for (const depId of currentTask.dependencies) {
        if (depId === targetTaskId) return true;
        if (hasCircularDependency(depId, targetTaskId, visited)) return true;
      }

      return false;
    };

    if (hasCircularDependency(dependencyId, taskId)) {
      return createValidationError(
        'dependencies',
        'Adding this dependency would create a circular dependency',
        'CIRCULAR_DEPENDENCY',
      );
    }

    return null;
  },

  projectTeamAssignment: (project: Project, teams: Team[], teamMembers: TeamMember[]): ValidationError | null => {
    if (!project.teamId) return null;

    const team = teams.find(t => t.id === project.teamId);
    if (!team) {
      return createValidationError(
        'teamId',
        'Assigned team does not exist',
        'TEAM_NOT_FOUND',
      );
    }

    // Check if project owner is a member of the assigned team
    const ownerMembership = teamMembers.find(m =>
      m.userId === project.ownerId &&
      m.teamId === project.teamId,
    );

    if (!ownerMembership) {
      return createValidationError(
        'teamAssignment',
        'Project owner must be a member of the assigned team',
        'OWNER_NOT_TEAM_MEMBER',
      );
    }

    return null;
  },

  taskAssignment: (task: Task, users: User[], project: Project, teamMembers: TeamMember[]): ValidationError | null => {
    if (!task.assigneeId) return null;

    const assignee = users.find(u => u.id === task.assigneeId);
    if (!assignee) {
      return createValidationError(
        'assigneeId',
        'Assigned user does not exist',
        'USER_NOT_FOUND',
      );
    }

    // If project has a team, assignee must be a team member
    if (project.teamId) {
      const membership = teamMembers.find(m =>
        m.userId === task.assigneeId &&
        m.teamId === project.teamId,
      );

      if (!membership) {
        return createValidationError(
          'assigneeId',
          'Task assignee must be a member of the project team',
          'ASSIGNEE_NOT_TEAM_MEMBER',
        );
      }
    }

    return null;
  },
};

// Comprehensive validators for entity operations
export const validateEntityOperation = {
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, users: User[], teams: Team[], teamMembers: TeamMember[]): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate owner exists
    const ownerError = validateEntityExists.user(project.ownerId, users);
    if (ownerError) errors.push(ownerError);

    // Validate team exists if specified
    if (project.teamId) {
      const teamError = validateEntityExists.team(project.teamId, teams);
      if (teamError) errors.push(teamError);
    }

    // Validate business rules
    const projectWithId = { ...project, id: 'temp' } as Project;
    const teamAssignmentError = validateBusinessRules.projectTeamAssignment(projectWithId, teams, teamMembers);
    if (teamAssignmentError) errors.push(teamAssignmentError);

    return createValidationResult(errors);
  },

  updateProject: (projectId: string, updates: Partial<Project>, projects: Project[], users: User[], teams: Team[], teamMembers: TeamMember[]): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate project exists
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      errors.push(createValidationError('projectId', 'Project not found', 'PROJECT_NOT_FOUND'));
      return createValidationResult(errors);
    }

    // Validate new owner if changing
    if (updates.ownerId) {
      const ownerError = validateEntityExists.user(updates.ownerId, users);
      if (ownerError) errors.push(ownerError);
    }

    // Validate new team if changing
    if (updates.teamId) {
      const teamError = validateEntityExists.team(updates.teamId, teams);
      if (teamError) errors.push(teamError);
    }

    // Validate business rules with updated project
    const updatedProject = { ...project, ...updates };
    const teamAssignmentError = validateBusinessRules.projectTeamAssignment(updatedProject, teams, teamMembers);
    if (teamAssignmentError) errors.push(teamAssignmentError);

    return createValidationResult(errors);
  },

  deleteProject: (projectId: string, projects: Project[], tasks: Task[]): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate project exists
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      errors.push(createValidationError('projectId', 'Project not found', 'PROJECT_NOT_FOUND'));
      return createValidationResult(errors);
    }

    // Check for dependent tasks
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length > 0) {
      errors.push(createValidationError(
        'deletion',
        `Cannot delete project with ${projectTasks.length} associated tasks`,
        'HAS_DEPENDENT_TASKS',
      ));
    }

    return createValidationResult(errors);
  },

  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, projects: Project[], users: User[], teams: Team[], teamMembers: TeamMember[], tasks: Task[]): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate project exists
    const projectError = validateEntityExists.project(task.projectId, projects);
    if (projectError) {
      errors.push(projectError);
      return createValidationResult(errors);
    }

    const project = projects.find(p => p.id === task.projectId)!;

    // Validate creator exists
    const creatorError = validateEntityExists.user(task.createdBy, users);
    if (creatorError) errors.push(creatorError);

    // Validate assignee if specified
    if (task.assigneeId) {
      const taskWithId = { ...task, id: 'temp' } as Task;
      const assignmentError = validateBusinessRules.taskAssignment(taskWithId, users, project, teamMembers);
      if (assignmentError) errors.push(assignmentError);
    }

    // Validate dependencies
    task.dependencies.forEach(depId => {
      const dependencyError = validateBusinessRules.taskDependencyValid('temp', depId, [...tasks, { ...task, id: 'temp' } as Task]);
      if (dependencyError) errors.push(dependencyError);
    });

    return createValidationResult(errors);
  },

  updateTask: (taskId: string, updates: Partial<Task>, tasks: Task[], projects: Project[], users: User[], teams: Team[], teamMembers: TeamMember[]): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate task exists
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      errors.push(createValidationError('taskId', 'Task not found', 'TASK_NOT_FOUND'));
      return createValidationResult(errors);
    }

    const project = projects.find(p => p.id === task.projectId);
    if (!project) {
      errors.push(createValidationError('projectId', 'Task project not found', 'PROJECT_NOT_FOUND'));
      return createValidationResult(errors);
    }

    // Validate new assignee if changing
    if (updates.assigneeId !== undefined) {
      const updatedTask = { ...task, ...updates };
      const assignmentError = validateBusinessRules.taskAssignment(updatedTask, users, project, teamMembers);
      if (assignmentError) errors.push(assignmentError);
    }

    // Validate new dependencies if changing
    if (updates.dependencies) {
      updates.dependencies.forEach(depId => {
        const dependencyError = validateBusinessRules.taskDependencyValid(taskId, depId, tasks);
        if (dependencyError) errors.push(dependencyError);
      });
    }

    return createValidationResult(errors);
  },

  addTeamMember: (teamMember: Omit<TeamMember, 'id' | 'joinedAt'>, teams: Team[], users: User[], existingMembers: TeamMember[]): ValidationResult => {
    const errors: ValidationError[] = [];

    // Validate team exists
    const teamError = validateEntityExists.team(teamMember.teamId, teams);
    if (teamError) errors.push(teamError);

    // Validate user exists
    const userError = validateEntityExists.user(teamMember.userId, users);
    if (userError) errors.push(userError);

    // Check if user is already a member
    const existingMembership = existingMembers.find(m =>
      m.userId === teamMember.userId &&
      m.teamId === teamMember.teamId,
    );

    if (existingMembership) {
      errors.push(createValidationError(
        'membership',
        'User is already a member of this team',
        'ALREADY_MEMBER',
      ));
    }

    return createValidationResult(errors);
  },
};

// Validation middleware for API operations
export const createValidationMiddleware = (validationFn: (...args: any[]) => ValidationResult) => {
  return (...args: any[]) => {
    const result = validationFn(...args);
    if (!result.isValid) {
      const error = new Error('Validation failed');
      (error as any).validationErrors = result.errors;
      throw error;
    }
    return result;
  };
};

// Export validation utilities
export const dataValidation = {
  validateEntityExists,
  validateBusinessRules,
  validateEntityOperation,
  createValidationMiddleware,
  createValidationError,
  createValidationResult,
};
