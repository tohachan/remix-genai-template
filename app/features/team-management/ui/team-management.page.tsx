import React, { useState } from 'react';
import { Button } from '~/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/ui/card';
import TeamList from './TeamList';
import MemberInvitation from './MemberInvitation';

interface TeamManagementPageProps {
  className?: string;
  selectedTeamId?: string;
}

export default function TeamManagementPage({ className, selectedTeamId }: TeamManagementPageProps) {
  const [activeTab, setActiveTab] = useState<string>(selectedTeamId ? 'members' : 'teams');
  const [currentTeamId, setCurrentTeamId] = useState<string | undefined>(selectedTeamId);

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your teams, invite members, and configure team settings
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeTab === 'teams' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('teams')}
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            Teams
          </Button>
          <Button
            variant={activeTab === 'members' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('members')}
            disabled={!currentTeamId}
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
          >
            Team Members
          </Button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'teams' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamList />
              </CardContent>
            </Card>
          )}

          {activeTab === 'members' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                {currentTeamId ? (
                  <MemberInvitation teamId={currentTeamId} />
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No team selected</h3>
                    <p className="text-muted-foreground">
                      Select a team from the Teams tab to manage its members
                    </p>
                    <Button onClick={() => setActiveTab('teams')} className="mt-4">
                      Back to Teams
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
