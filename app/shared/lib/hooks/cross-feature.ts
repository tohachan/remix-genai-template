/**
 * Cross-Feature Data Hooks
 * Provides unified data access across multiple features with proper relationships
 */

import { useMemo } from 'react';
import { useGetProjectsQuery } from '~/features/project-management/api';
import { useGetTasksQuery } from '~/features/task-management/api';
import { useGetTeamsQuery, useGetTeamMembersQuery } from '~/features/team-management/api';
import { useGetCurrentUserQuery } from '~/features/authentication/api';
import type { Task } from '~/entities/task';
import type { Project } from '~/entities/project';
import type { User } from '~/entities/user';

// Project with related data (simplified version that works with current APIs)
export const useProjectWithRelations = (projectId: string) => {
  const { data: projectsData, ...projectQuery } = useGetProjectsQuery();
  const project = projectsData?.data.find(p => p.id === projectId);

  const { data: tasksData } = useGetTasksQuery({ projectId });

  const projectWithRelations = useMemo(() => {
    if (!project) return null;

    const tasks = tasksData?.data || [];
    const completedTasks = tasks.filter(task => task.status === 'done');
    const overdueTasks = tasks.filter(task => {
      return task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';
    });

    return {
      ...project,
      tasks,
      completedTasks,
      overdueTasks,
      taskCount: tasks.length,
      completedTaskCount: completedTasks.length,
      overdueTaskCount: overdueTasks.length,
      progress: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    };
  }, [project, tasksData]);

  return {
    data: projectWithRelations,
    isLoading: projectQuery.isLoading,
    error: projectQuery.error,
  };
};

// User with all related data (simplified version)
export const useUserWithRelations = (userId?: string) => {
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.user;
  const targetUserId = userId || currentUser?.id;

  const { data: projectsData } = useGetProjectsQuery();
  const { data: tasksData } = useGetTasksQuery(targetUserId ? { assigneeId: targetUserId } : undefined);
  const { data: teamsData } = useGetTeamsQuery({});

  const userWithRelations = useMemo(() => {
    if (!currentUser || (userId && userId !== currentUser.id)) return null;

    // Filter projects and tasks manually since the APIs don't support filtering
    const allProjects = projectsData?.data || [];
    const allTasks = tasksData?.data || [];

    // For now, just return user stats based on available data
    const assignedTasks = allTasks.filter(task => task.assigneeId === targetUserId);
    const completedTasks = assignedTasks.filter(task => task.status === 'done');
    const overdueTasks = assignedTasks.filter(task => {
      return task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';
    });

    return {
      ...currentUser,
      assignedTasks,
      completedTasks,
      overdueTasks,
      stats: {
        totalTasks: assignedTasks.length,
        completedTasks: completedTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: assignedTasks.length > 0
          ? Math.round((completedTasks.length / assignedTasks.length) * 100)
          : 0,
      },
    };
  }, [currentUser, projectsData, tasksData, targetUserId, userId]);

  return {
    data: userWithRelations,
    isLoading: !currentUser,
  };
};

// Team with all related data (simplified version)
export const useTeamWithRelations = (teamId: string) => {
  const { data: teamsData, ...teamsQuery } = useGetTeamsQuery({});
  const { data: membersData } = useGetTeamMembersQuery({ teamId });
  const { data: projectsData } = useGetProjectsQuery();
  const { data: tasksData } = useGetTasksQuery();

  const team = teamsData?.teams.find(t => t.id === teamId);

  const teamWithRelations = useMemo(() => {
    if (!team) return null;

    const members = membersData?.members || [];
    // Filter projects and tasks manually since APIs don't support team filtering yet
    const projects = projectsData?.data || [];
    const tasks = tasksData?.data || [];

    const activeProjects = projects.filter(p => p.status === 'active');
    const completedTasks = tasks.filter(t => t.status === 'done');

    return {
      ...team,
      members,
      projects,
      tasks,
      stats: {
        totalMembers: members.length,
        adminCount: members.filter((m: any) => m.role === 'admin').length,
        memberCount: members.filter((m: any) => m.role === 'member').length,
        totalProjects: projects.length,
        activeProjects: activeProjects.length,
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        averageProgress: 0, // Simplified for now
      },
    };
  }, [team, membersData, projectsData, tasksData, teamId]);

  return {
    data: teamWithRelations,
    isLoading: teamsQuery.isLoading,
    error: teamsQuery.error,
  };
};

// Dashboard data aggregation (simplified version)
export const useDashboardData = () => {
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.user;
  const { data: projectsData } = useGetProjectsQuery();
  const { data: tasksData } = useGetTasksQuery();
  const { data: teamsData } = useGetTeamsQuery({});

  const dashboardData = useMemo(() => {
    if (!currentUser) return null;

    const allProjects = projectsData?.data || [];
    const allTasks = tasksData?.data || [];
    const allTeams = teamsData?.teams || [];

    // Simplified filtering - in a real app this would be more sophisticated
    const userTasks = allTasks.filter(task =>
      task.assigneeId === currentUser.id || task.createdBy === currentUser.id,
    );

    const completedTasks = userTasks.filter(task => task.status === 'done');
    const overdueTasks = userTasks.filter(task => {
      return task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done';
    });

    const recentActivity = [
      ...userTasks
        .filter(task => {
          const updatedAt = new Date(task.updatedAt);
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
          return updatedAt > threeDaysAgo;
        })
        .map(task => ({
          type: 'task_updated' as const,
          entityId: task.id,
          entityName: task.title,
          timestamp: task.updatedAt,
          description: `Task "${task.title}" was updated`,
        })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      user: currentUser,
      projects: allProjects,
      tasks: userTasks,
      teams: allTeams,
      stats: {
        totalProjects: allProjects.length,
        activeProjects: allProjects.filter(p => p.status === 'active').length,
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: userTasks.length > 0
          ? Math.round((completedTasks.length / userTasks.length) * 100)
          : 0,
        teamCount: allTeams.length,
      },
      recentActivity: recentActivity.slice(0, 10),
    };
  }, [currentUser, projectsData, tasksData, teamsData]);

  return {
    data: dashboardData,
    isLoading: !currentUser,
  };
};

// Analytics data (simplified version)
export const useAnalyticsData = (timeRange = '30d') => {
  const { data: tasksData } = useGetTasksQuery();
  const { data: projectsData } = useGetProjectsQuery();
  const { data: teamsData } = useGetTeamsQuery({});

  const analyticsData = useMemo(() => {
    if (!tasksData || !projectsData || !teamsData) return null;

    const tasks = tasksData.data;
    const projects = projectsData.data;
    const teams = teamsData.teams;

    // Simplified analytics calculations
    const completedTasks = tasks.filter(task => task.status === 'done');
    const totalTasks = tasks.length;

    // Mock burndown data - in real app this would be calculated from historical data
    const burndownData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      planned: Math.max(totalTasks - Math.floor((i / 30) * totalTasks), 0),
      actual: Math.max(totalTasks - Math.floor((i / 25) * totalTasks), 0),
    }));

    // Mock team workload data
    const teamWorkload = teams.map(team => ({
      teamName: team.name,
      taskCount: Math.floor(Math.random() * 20) + 5,
      completedCount: Math.floor(Math.random() * 15) + 2,
    }));

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      completionRate: totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0,
      burndownData,
      teamWorkload,
      timeRange,
    };
  }, [tasksData, projectsData, teamsData, timeRange]);

  return {
    data: analyticsData,
    isLoading: !tasksData || !projectsData || !teamsData,
  };
};

// Global search (simplified version)
export const useGlobalSearch = (query: string) => {
  const { data: projectsData } = useGetProjectsQuery();
  const { data: tasksData } = useGetTasksQuery();
  const { data: teamsData } = useGetTeamsQuery({});

  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;

    const lowerQuery = query.toLowerCase();
    const results: any[] = [];

    // Search projects
    if (projectsData?.data) {
      const matchedProjects = projectsData.data.filter(project =>
        project.title.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery),
      );
      results.push(...matchedProjects.map(project => ({
        type: 'project',
        id: project.id,
        title: project.title,
        description: project.description,
      })));
    }

    // Search tasks
    if (tasksData?.data) {
      const matchedTasks = tasksData.data.filter(task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery),
      );
      results.push(...matchedTasks.map(task => ({
        type: 'task',
        id: task.id,
        title: task.title,
        description: task.description,
      })));
    }

    // Search teams
    if (teamsData?.teams) {
      const matchedTeams = teamsData.teams.filter(team =>
        team.name.toLowerCase().includes(lowerQuery) ||
        team.description.toLowerCase().includes(lowerQuery),
      );
      results.push(...matchedTeams.map(team => ({
        type: 'team',
        id: team.id,
        title: team.name,
        description: team.description,
      })));
    }

    return results.slice(0, 20); // Limit results
  }, [query, projectsData, tasksData, teamsData]);

  return {
    data: searchResults,
    isLoading: false,
  };
};
