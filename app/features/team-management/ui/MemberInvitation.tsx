import React, { useState } from 'react';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/card';
import { Badge } from '~/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/shared/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/shared/ui/dialog';
import { useTeamMembers, useInviteMember, useUpdateMemberRole, useRemoveMember } from '../hooks';
import type { TeamRole, TeamMember } from '~/entities/team';

interface MemberInvitationProps {
  teamId: string;
  className?: string;
}

export default function MemberInvitation({ teamId, className }: MemberInvitationProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('member');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const {
    members,
    isLoading: membersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useTeamMembers(teamId);

  const { inviteMember, isInviting, error: inviteError } = useInviteMember();
  const { updateMemberRole, isUpdating } = useUpdateMemberRole();
  const { requestRemove, confirmRemove, isRemoving } = useRemoveMember();

  const handleInviteMember = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.trim()) return;

    const result = await inviteMember(teamId, {
      email: inviteEmail.trim(),
      role: inviteRole,
    });

    if (result.success) {
      setInviteEmail('');
      setInviteRole('member');
      setIsInviteDialogOpen(false);
      refetchMembers();
    }
  };

  const handleRoleChange = async(memberId: string, newRole: TeamRole) => {
    const result = await updateMemberRole(teamId, memberId, newRole);
    if (result.success) {
      refetchMembers();
    }
  };

  const handleRemoveMember = async(memberId: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      requestRemove(teamId, memberId);
      const result = await confirmRemove();
      if (result.success) {
        refetchMembers();
      }
    }
  };

  const getRoleBadgeVariant = (role: TeamRole) => {
    switch (role) {
    case 'admin':
      return 'destructive';
    case 'member':
      return 'default';
    default:
      return 'secondary';
    }
  };

  if (membersError) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive mb-2">Error loading team members</p>
        <Button onClick={refetchMembers} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage team members and their roles ({members.length} members)
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          Invite Member
        </Button>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {membersLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div>
                        <div className="h-4 bg-muted rounded w-32 mb-1"></div>
                        <div className="h-3 bg-muted rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : members.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h4 className="font-medium mb-2">No team members yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Invite your first team member to get started
              </p>
              <Button onClick={() => setIsInviteDialogOpen(true)}>
                Invite Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {member.user.avatar ? (
                      <img
                        src={member.user.avatar}
                        alt={member.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{member.user.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={member.role}
                      onValueChange={(value: TeamRole) => handleRoleChange(member.id, value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id, member.user.name)}
                      disabled={isRemoving}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleInviteMember} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Role
              </label>
              <Select value={inviteRole} onValueChange={(value: TeamRole) => setInviteRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inviteError && (
              <div className="text-sm text-destructive">
                Failed to send invitation. Please try again.
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isInviting || !inviteEmail.trim()}
                className="flex-1"
              >
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
