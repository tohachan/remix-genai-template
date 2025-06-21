// UI Components
export { default as TeamManagementPage } from './ui/team-management.page';
export { default as TeamList } from './ui/TeamList';
export { TeamForm } from './ui/TeamForm';
export { default as MemberInvitation } from './ui/MemberInvitation';

// Hooks
export {
  useTeamManagement,
  useTeams,
  useTeam,
  useCreateTeam,
  useUpdateTeam,
  useDeleteTeam,
  useTeamMembers,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
  useTeamInvitations,
} from './hooks';

// API
export { teamManagementApi } from './api';
export type {
  GetTeamsApiRequest,
  GetTeamsApiResponse,
  CreateTeamApiRequest,
  CreateTeamApiResponse,
  UpdateTeamApiRequest,
  UpdateTeamApiResponse,
  DeleteTeamApiRequest,
  DeleteTeamApiResponse,
  GetTeamMembersApiRequest,
  GetTeamMembersApiResponse,
  InviteMemberApiRequest,
  InviteMemberApiResponse,
  UpdateMemberRoleApiRequest,
  UpdateMemberRoleApiResponse,
  RemoveMemberApiRequest,
  RemoveMemberApiResponse,
  GetTeamInvitationsApiRequest,
  GetTeamInvitationsApiResponse,
} from './api';
