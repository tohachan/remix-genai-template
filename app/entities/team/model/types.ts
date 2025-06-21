/**
 * Team Entity Types
 * Defines team-related data structures and types for team management functionality
 */

import type { User, UserRole } from '~/entities/user';

export type TeamRole = 'admin' | 'member';

export interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  memberCount: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  joinedAt: string;
  invitedBy: string;
  user: User;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
  token: string;
}

export interface CreateTeamData {
  name: string;
  description: string;
  color: string;
  avatar?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  color?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface InviteMemberData {
  email: string;
  role: TeamRole;
}

export interface UpdateMemberRoleData {
  memberId: string;
  role: TeamRole;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  adminCount: number;
  memberCount: number;
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
  stats: TeamStats;
}

export interface TeamQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface MemberQueryParams {
  teamId: string;
  role?: TeamRole;
  search?: string;
}
