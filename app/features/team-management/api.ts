/**
 * TeamManagement Feature API
 * Backend interactions and data fetching logic for team-management feature
 */

import { baseApi } from '~/shared/lib/store/api';
import type {
  Team,
  TeamMember,
  TeamInvitation,
  CreateTeamData,
  UpdateTeamData,
  InviteMemberData,
  UpdateMemberRoleData,
  TeamWithMembers,
  TeamQueryParams,
  MemberQueryParams,
} from '~/entities/team';

// API Contract Definitions - Required by enforce-contracts rule
// These interfaces define the request/response contracts for API endpoints

/**
 * Request contract for getting teams with optional filtering and pagination
 */
export type GetTeamsApiRequest = TeamQueryParams;

/**
 * Response contract for teams list endpoint
 */
export interface GetTeamsApiResponse {
  teams: TeamWithMembers[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Request contract for getting team by ID
 */
export type GetTeamByIdApiRequest = string;

/**
 * Response contract for single team endpoint
 */
export interface GetTeamByIdApiResponse {
  team: TeamWithMembers;
}

/**
 * Request contract for creating a new team
 */
export type CreateTeamApiRequest = CreateTeamData;

/**
 * Response contract for team creation endpoint
 */
export interface CreateTeamApiResponse {
  team: TeamWithMembers;
}

/**
 * Request contract for updating team data
 */
export interface UpdateTeamApiRequest {
  id: string;
  data: UpdateTeamData;
}

/**
 * Response contract for team update endpoint
 */
export interface UpdateTeamApiResponse {
  team: TeamWithMembers;
}

/**
 * Request contract for team deletion
 */
export type DeleteTeamApiRequest = string;

/**
 * Response contract for team deletion endpoint
 */
export interface DeleteTeamApiResponse {
  success: boolean;
}

/**
 * Request contract for getting team members
 */
export type GetTeamMembersApiRequest = MemberQueryParams;

/**
 * Response contract for team members endpoint
 */
export interface GetTeamMembersApiResponse {
  members: TeamMember[];
}

/**
 * Request contract for inviting team member
 */
export interface InviteMemberApiRequest {
  teamId: string;
  data: InviteMemberData;
}

/**
 * Response contract for member invitation endpoint
 */
export interface InviteMemberApiResponse {
  invitation: TeamInvitation;
}

/**
 * Request contract for updating member role
 */
export interface UpdateMemberRoleApiRequest {
  teamId: string;
  memberId: string;
  role: string;
}

/**
 * Response contract for member role update endpoint
 */
export interface UpdateMemberRoleApiResponse {
  member: TeamMember;
}

/**
 * Request contract for removing team member
 */
export interface RemoveMemberApiRequest {
  teamId: string;
  memberId: string;
}

/**
 * Response contract for member removal endpoint
 */
export interface RemoveMemberApiResponse {
  success: boolean;
}

/**
 * Request contract for getting team invitations
 */
export type GetTeamInvitationsApiRequest = string;

/**
 * Response contract for team invitations endpoint
 */
export interface GetTeamInvitationsApiResponse {
  invitations: TeamInvitation[];
}

// RTK Query API endpoints for team management
export const teamManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Team CRUD operations
    getTeams: builder.query<GetTeamsApiResponse, GetTeamsApiRequest>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

        return {
          url: `teams?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
            ...result.teams.map(({ id }) => ({ type: 'Team' as const, id })),
            { type: 'Team', id: 'LIST' },
          ]
          : [{ type: 'Team', id: 'LIST' }],
    }),

    getTeamById: builder.query<GetTeamByIdApiResponse, GetTeamByIdApiRequest>({
      query: (id) => ({
        url: `teams/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),

    createTeam: builder.mutation<CreateTeamApiResponse, CreateTeamApiRequest>({
      query: (teamData) => ({
        url: 'teams',
        method: 'POST',
        body: teamData,
      }),
      invalidatesTags: [{ type: 'Team', id: 'LIST' }],
    }),

    updateTeam: builder.mutation<UpdateTeamApiResponse, UpdateTeamApiRequest>({
      query: ({ id, data }) => ({
        url: `teams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Team', id },
        { type: 'Team', id: 'LIST' },
      ],
    }),

    deleteTeam: builder.mutation<DeleteTeamApiResponse, DeleteTeamApiRequest>({
      query: (id) => ({
        url: `teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Team', id },
        { type: 'Team', id: 'LIST' },
      ],
    }),

    // Team member operations
    getTeamMembers: builder.query<GetTeamMembersApiResponse, GetTeamMembersApiRequest>({
      query: ({ teamId, role, search }) => {
        const searchParams = new URLSearchParams();
        if (role) searchParams.append('role', role);
        if (search) searchParams.append('search', search);

        return {
          url: `teams/${teamId}/members?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { teamId }) => [
        { type: 'TeamMember', id: teamId },
        { type: 'Team', id: teamId },
      ],
    }),

    inviteMember: builder.mutation<InviteMemberApiResponse, InviteMemberApiRequest>({
      query: ({ teamId, data }) => ({
        url: `teams/${teamId}/invite`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'TeamMember', id: teamId },
        { type: 'TeamInvitation', id: teamId },
        { type: 'Team', id: teamId },
      ],
    }),

    updateMemberRole: builder.mutation<UpdateMemberRoleApiResponse, UpdateMemberRoleApiRequest>({
      query: ({ teamId, memberId, role }) => ({
        url: `teams/${teamId}/members/${memberId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'TeamMember', id: teamId },
        { type: 'Team', id: teamId },
      ],
    }),

    removeMember: builder.mutation<RemoveMemberApiResponse, RemoveMemberApiRequest>({
      query: ({ teamId, memberId }) => ({
        url: `teams/${teamId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'TeamMember', id: teamId },
        { type: 'Team', id: teamId },
        { type: 'Team', id: 'LIST' },
      ],
    }),

    // Team invitation operations
    getTeamInvitations: builder.query<GetTeamInvitationsApiResponse, GetTeamInvitationsApiRequest>({
      query: (teamId) => ({
        url: `teams/${teamId}/invitations`,
        method: 'GET',
      }),
      providesTags: (result, error, teamId) => [
        { type: 'TeamInvitation', id: teamId },
      ],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamMembersQuery,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useGetTeamInvitationsQuery,
} = teamManagementApi;
