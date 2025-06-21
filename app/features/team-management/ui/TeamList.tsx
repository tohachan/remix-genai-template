import React, { useState } from 'react';
import { Button } from '~/shared/ui/button';
import { Input } from '~/shared/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/shared/ui/dialog';
import { Badge } from '~/shared/ui/badge';
import { useTeams, useDeleteTeam } from '../hooks';
import { TeamForm } from './TeamForm';
import type { TeamWithMembers } from '~/entities/team';

interface TeamListProps {
  className?: string;
}

export default function TeamList({ className }: TeamListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamWithMembers | null>(null);

  const {
    teams,
    pagination,
    isLoading,
    error,
    refetch,
  } = useTeams({
    page,
    limit: 12,
    search: searchQuery,
  });

  const { requestDelete, confirmDelete, cancelDelete, isDeleting, pendingDeleteTeamId } = useDeleteTeam();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  };

  const handleDeleteTeam = async(teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      requestDelete(teamId);
      const result = await confirmDelete();
      if (result.success) {
        refetch();
      }
    }
  };

  const handleEditTeam = (team: TeamWithMembers) => {
    setEditingTeam(team);
  };

  const handleCloseEdit = () => {
    setEditingTeam(null);
  };

  const handleTeamCreated = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleTeamUpdated = () => {
    setEditingTeam(null);
    refetch();
  };

  const totalTeams = pagination?.total || 0;
  const totalPages = pagination?.pages || 1;

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading teams</p>
          <Button onClick={refetch} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Teams</h2>
          <p className="text-muted-foreground">
            Manage your teams and members ({totalTeams} teams)
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Team</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <TeamForm
              onSuccess={handleTeamCreated}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Teams Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No teams found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search criteria' : 'Create your first team to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Your First Team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {team.avatar && (
                      <img
                        src={team.avatar}
                        alt={team.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={team.isActive ? 'default' : 'secondary'}>
                          {team.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {team.color && (
                          <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: team.color }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {team.description || 'No description provided'}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{team.memberCount || 0} members</span>
                  <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditTeam(team)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTeam(team.id)}
                    disabled={isDeleting && pendingDeleteTeamId === team.id}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Team Dialog */}
      {editingTeam && (
        <Dialog open={true} onOpenChange={handleCloseEdit}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Team</DialogTitle>
            </DialogHeader>
            <TeamForm
              team={editingTeam}
              onSuccess={handleTeamUpdated}
              onCancel={handleCloseEdit}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
