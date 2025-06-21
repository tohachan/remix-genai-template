/**
 * Team Management Feature Hooks
 * React hooks specific to team-management feature
 */

import { useState, useCallback } from 'react';
import {
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
} from './api';
import type {
  CreateTeamData,
  UpdateTeamData,
  InviteMemberData,
  TeamQueryParams,
  MemberQueryParams,
  TeamRole,
} from '~/entities/team';

/**
 * Hook for managing teams list and pagination
 */
export const useTeams = (initialParams: TeamQueryParams = {}) => {
  const [params, setParams] = useState<TeamQueryParams>(initialParams);

  const {
    data: teamsData,
    isLoading,
    error,
    refetch,
  } = useGetTeamsQuery(params);

  const updateParams = useCallback((newParams: Partial<TeamQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(initialParams);
  }, [initialParams]);

  return {
    teams: teamsData?.teams || [],
    pagination: teamsData?.pagination,
    isLoading,
    error,
    params,
    updateParams,
    resetParams,
    refetch,
  };
};

/**
 * Hook for managing a single team with full details
 */
export const useTeam = (teamId: string | undefined) => {
  const {
    data: teamData,
    isLoading,
    error,
    refetch,
  } = useGetTeamByIdQuery(teamId!, {
    skip: !teamId,
  });

  return {
    team: teamData?.team,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for creating teams with loading and error states
 */
export const useCreateTeam = () => {
  const [createTeamMutation, { isLoading, error }] = useCreateTeamMutation();

  const createTeam = useCallback(async(teamData: CreateTeamData) => {
    try {
      const result = await createTeamMutation(teamData).unwrap();
      return { success: true, team: result.team };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [createTeamMutation]);

  return {
    createTeam,
    isCreating: isLoading,
    error,
  };
};

/**
 * Hook for updating teams with optimistic updates
 */
export const useUpdateTeam = () => {
  const [updateTeamMutation, { isLoading, error }] = useUpdateTeamMutation();

  const updateTeam = useCallback(async(id: string, data: UpdateTeamData) => {
    try {
      const result = await updateTeamMutation({ id, data }).unwrap();
      return { success: true, team: result.team };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [updateTeamMutation]);

  return {
    updateTeam,
    isUpdating: isLoading,
    error,
  };
};

/**
 * Hook for deleting teams with confirmation
 */
export const useDeleteTeam = () => {
  const [deleteTeamMutation, { isLoading, error }] = useDeleteTeamMutation();
  const [confirmationTeamId, setConfirmationTeamId] = useState<string | null>(null);

  const requestDelete = useCallback((teamId: string) => {
    setConfirmationTeamId(teamId);
  }, []);

  const confirmDelete = useCallback(async() => {
    if (!confirmationTeamId) return { success: false, error: 'No team selected' };

    try {
      await deleteTeamMutation(confirmationTeamId).unwrap();
      setConfirmationTeamId(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [deleteTeamMutation, confirmationTeamId]);

  const cancelDelete = useCallback(() => {
    setConfirmationTeamId(null);
  }, []);

  return {
    requestDelete,
    confirmDelete,
    cancelDelete,
    isDeleting: isLoading,
    error,
    pendingDeleteTeamId: confirmationTeamId,
  };
};

/**
 * Hook for managing team members
 */
export const useTeamMembers = (teamId: string | undefined, initialParams: Omit<MemberQueryParams, 'teamId'> = {}) => {
  const [params, setParams] = useState<Omit<MemberQueryParams, 'teamId'>>(initialParams);

  const {
    data: membersData,
    isLoading,
    error,
    refetch,
  } = useGetTeamMembersQuery(
    { teamId: teamId!, ...params },
    { skip: !teamId },
  );

  const updateParams = useCallback((newParams: Partial<Omit<MemberQueryParams, 'teamId'>>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return {
    members: membersData?.members || [],
    isLoading,
    error,
    params,
    updateParams,
    refetch,
  };
};

/**
 * Hook for inviting team members
 */
export const useInviteMember = () => {
  const [inviteMemberMutation, { isLoading, error }] = useInviteMemberMutation();

  const inviteMember = useCallback(async(teamId: string, data: InviteMemberData) => {
    try {
      const result = await inviteMemberMutation({ teamId, data }).unwrap();
      return { success: true, invitation: result.invitation };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [inviteMemberMutation]);

  return {
    inviteMember,
    isInviting: isLoading,
    error,
  };
};

/**
 * Hook for updating member roles
 */
export const useUpdateMemberRole = () => {
  const [updateMemberRoleMutation, { isLoading, error }] = useUpdateMemberRoleMutation();

  const updateMemberRole = useCallback(async(teamId: string, memberId: string, role: TeamRole) => {
    try {
      const result = await updateMemberRoleMutation({ teamId, memberId, role }).unwrap();
      return { success: true, member: result.member };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [updateMemberRoleMutation]);

  return {
    updateMemberRole,
    isUpdating: isLoading,
    error,
  };
};

/**
 * Hook for removing team members
 */
export const useRemoveMember = () => {
  const [removeMemberMutation, { isLoading, error }] = useRemoveMemberMutation();
  const [confirmationMember, setConfirmationMember] = useState<{ teamId: string; memberId: string } | null>(null);

  const requestRemove = useCallback((teamId: string, memberId: string) => {
    setConfirmationMember({ teamId, memberId });
  }, []);

  const confirmRemove = useCallback(async() => {
    if (!confirmationMember) return { success: false, error: 'No member selected' };

    try {
      await removeMemberMutation(confirmationMember).unwrap();
      setConfirmationMember(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [removeMemberMutation, confirmationMember]);

  const cancelRemove = useCallback(() => {
    setConfirmationMember(null);
  }, []);

  return {
    requestRemove,
    confirmRemove,
    cancelRemove,
    isRemoving: isLoading,
    error,
    pendingRemoveMember: confirmationMember,
  };
};

/**
 * Hook for managing team invitations
 */
export const useTeamInvitations = (teamId: string | undefined) => {
  const {
    data: invitationsData,
    isLoading,
    error,
    refetch,
  } = useGetTeamInvitationsQuery(teamId!, {
    skip: !teamId,
  });

  return {
    invitations: invitationsData?.invitations || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Composite hook for complete team management functionality
 */
export const useTeamManagement = (teamId?: string) => {
  const teams = useTeams();
  const team = useTeam(teamId);
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();
  const members = useTeamMembers(teamId);
  const inviteMember = useInviteMember();
  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();
  const invitations = useTeamInvitations(teamId);

  const isLoading = teams.isLoading || team.isLoading || members.isLoading || invitations.isLoading;
  const hasError = teams.error || team.error || members.error || invitations.error;

  return {
    // Teams management
    teams,
    team,
    createTeam,
    updateTeam,
    deleteTeam,

    // Members management
    members,
    inviteMember,
    updateMemberRole,
    removeMember,

    // Invitations management
    invitations,

    // Global states
    isLoading,
    hasError,

    // Utility functions
    refreshAll: () => {
      teams.refetch();
      if (teamId) {
        team.refetch();
        members.refetch();
        invitations.refetch();
      }
    },
  };
};
