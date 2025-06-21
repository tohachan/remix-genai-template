/**
 * In-Memory Database for MSW
 * Provides a database-like structure with relationships and referential integrity
 */

import type { User } from '~/entities/user';
import type { Team, TeamMember, TeamInvitation } from '~/entities/team';
import type { Project } from '~/entities/project';
import type { Task } from '~/entities/task';

// Database Schema
export interface Database {
  users: Map<string, User>;
  teams: Map<string, Team>;
  teamMembers: Map<string, TeamMember>;
  teamInvitations: Map<string, TeamInvitation>;
  projects: Map<string, Project>;
  tasks: Map<string, Task>;

  // Relationship indexes for efficient queries
  indexes: {
    usersByTeam: Map<string, Set<string>>; // teamId -> Set<userId>
    projectsByTeam: Map<string, Set<string>>; // teamId -> Set<projectId>
    projectsByOwner: Map<string, Set<string>>; // userId -> Set<projectId>
    tasksByProject: Map<string, Set<string>>; // projectId -> Set<taskId>
    tasksByAssignee: Map<string, Set<string>>; // userId -> Set<taskId>
    tasksByCreator: Map<string, Set<string>>; // userId -> Set<taskId>
    membershipsByUser: Map<string, Set<string>>; // userId -> Set<teamMembershipId>
    invitationsByTeam: Map<string, Set<string>>; // teamId -> Set<invitationId>
  };
}

// Database instance
let database: Database;

// Initialize database
export const initializeDatabase = (): Database => {
  database = {
    users: new Map(),
    teams: new Map(),
    teamMembers: new Map(),
    teamInvitations: new Map(),
    projects: new Map(),
    tasks: new Map(),
    indexes: {
      usersByTeam: new Map(),
      projectsByTeam: new Map(),
      projectsByOwner: new Map(),
      tasksByProject: new Map(),
      tasksByAssignee: new Map(),
      tasksByCreator: new Map(),
      membershipsByUser: new Map(),
      invitationsByTeam: new Map(),
    },
  };

  return database;
};

// Get database instance
export const getDatabase = (): Database => {
  if (!database) {
    return initializeDatabase();
  }
  return database;
};
