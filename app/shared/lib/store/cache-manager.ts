/**
 * Cache Management Strategy for RTK Query
 * Handles entity relationships and cache invalidation across the data layer
 */

import type { ApiTagTypes } from './api';
import { CACHE_INVALIDATION_STRATEGY, type CacheInvalidationMap } from '../data/relationships';

// Cache tag utilities
export const createEntityTag = (entityType: ApiTagTypes, id?: string): string => {
  return id ? `${entityType}:${id}` : entityType;
};

export const createListTag = (entityType: ApiTagTypes, filters?: Record<string, any>): string => {
  const filterStr = filters ? JSON.stringify(filters) : '';
  return `${entityType}List${filterStr ? `:${btoa(filterStr)}` : ''}`;
};

// Cache invalidation utilities
export const getInvalidationTags = (
  entityType: ApiTagTypes,
  operation: 'create' | 'update' | 'delete',
  entityId?: string,
): string[] => {
  const strategy = CACHE_INVALIDATION_STRATEGY[entityType as keyof CacheInvalidationMap];
  const tags: string[] = [];

  // Always invalidate the entity itself
  if (entityId) {
    tags.push(createEntityTag(entityType, entityId));
  }

  // Invalidate entity list
  tags.push(createListTag(entityType));

  // Invalidate related entities based on strategy if strategy exists
  if (strategy) {
    strategy.invalidates.forEach((relatedType: ApiTagTypes) => {
      tags.push(createListTag(relatedType));
    });

    // Add cascade invalidations
    strategy.cascades.forEach((cascadeTag: string) => {
      tags.push(cascadeTag);
    });
  }

  return tags;
};

// Provides tags for queries (what the query provides)
export const getProvidesTags = (
  entityType: ApiTagTypes,
  result: any,
  isListQuery = false,
): string[] => {
  const tags: string[] = [];

  if (isListQuery && Array.isArray(result?.data)) {
    // For list queries, provide list tag and individual entity tags
    tags.push(createListTag(entityType));
    result.data.forEach((entity: any) => {
      if (entity.id) {
        tags.push(createEntityTag(entityType, entity.id));
      }
    });
  } else if (result?.data) {
    // For single entity queries
    if (result.data.id) {
      tags.push(createEntityTag(entityType, result.data.id));
    }
  } else if (result?.id) {
    // Direct entity result
    tags.push(createEntityTag(entityType, result.id));
  }

  return tags;
};

// Cache time configurations based on entity type and operation
export const getCacheConfig = (entityType: ApiTagTypes, withRelations = false) => {
  const baseConfig = {
    User: { cacheTime: 5 * 60 * 1000, staleTime: 2 * 60 * 1000 },
    Auth: { cacheTime: 10 * 60 * 1000, staleTime: 5 * 60 * 1000 },
    Profile: { cacheTime: 5 * 60 * 1000, staleTime: 2 * 60 * 1000 },
    Team: { cacheTime: 10 * 60 * 1000, staleTime: 5 * 60 * 1000 },
    TeamMember: { cacheTime: 5 * 60 * 1000, staleTime: 2 * 60 * 1000 },
    TeamInvitation: { cacheTime: 2 * 60 * 1000, staleTime: 1 * 60 * 1000 },
    Project: { cacheTime: 5 * 60 * 1000, staleTime: 2 * 60 * 1000 },
    Task: { cacheTime: 2 * 60 * 1000, staleTime: 30 * 1000 },
    Analytics: { cacheTime: 3 * 60 * 1000, staleTime: 1 * 60 * 1000 },
  };

  const config = baseConfig[entityType] || { cacheTime: 5 * 60 * 1000, staleTime: 2 * 60 * 1000 };

  // Reduce cache times for queries with relations (more complex data)
  if (withRelations) {
    return {
      cacheTime: Math.floor(config.cacheTime * 0.6),
      staleTime: Math.floor(config.staleTime * 0.6),
    };
  }

  return config;
};

// Optimistic update utilities
export const createOptimisticUpdate = <T>(
  entityType: ApiTagTypes,
  entityId: string,
  updates: Partial<T>,
) => {
  return {
    type: 'updateQueryData' as const,
    endpointName: `get${entityType}`,
    args: entityId,
    updateRecipe: (draft: T) => {
      Object.assign(draft as any, updates, { updatedAt: new Date().toISOString() });
    },
  };
};

// Cache synchronization utilities
export const syncRelatedEntities = (
  entityType: ApiTagTypes,
  entityData: any,
  api: any,
) => {
  const patches: any[] = [];

  switch (entityType) {
  case 'Task':
    // When task is updated, sync project task counts
    if (entityData.projectId) {
      patches.push({
        type: 'invalidateTags' as const,
        tags: [createListTag('Project'), createEntityTag('Project', entityData.projectId)],
      });
    }

    // Sync user task assignments
    if (entityData.assigneeId) {
      patches.push({
        type: 'invalidateTags' as const,
        tags: [createListTag('User'), createEntityTag('User', entityData.assigneeId)],
      });
    }
    break;

  case 'Project':
    // When project is updated, sync related tasks and team
    patches.push({
      type: 'invalidateTags' as const,
      tags: [createListTag('Task')],
    });

    if (entityData.teamId) {
      patches.push({
        type: 'invalidateTags' as const,
        tags: [createEntityTag('Team', entityData.teamId)],
      });
    }
    break;

  case 'TeamMember':
    // When team membership changes, sync user and team data
    patches.push({
      type: 'invalidateTags' as const,
      tags: [
        createEntityTag('User', entityData.userId),
        createEntityTag('Team', entityData.teamId),
        createListTag('Project'),
      ],
    });
    break;

  default:
    break;
  }

  return patches;
};

// Cache warming strategies
export const warmRelatedCache = async(
  entityType: ApiTagTypes,
  entityId: string,
  api: any,
) => {
  switch (entityType) {
  case 'User':
    // Warm user's teams and projects
    api.dispatch(api.endpoints.getUserTeams.initiate(entityId));
    api.dispatch(api.endpoints.getUserProjects.initiate(entityId));
    break;

  case 'Team':
    // Warm team members and projects
    api.dispatch(api.endpoints.getTeamMembers.initiate(entityId));
    api.dispatch(api.endpoints.getTeamProjects.initiate(entityId));
    break;

  case 'Project':
    // Warm project tasks and members
    api.dispatch(api.endpoints.getProjectTasks.initiate(entityId));
    api.dispatch(api.endpoints.getProject.initiate(entityId));
    break;

  default:
    break;
  }
};

// Cache cleanup utilities
export const cleanupStaleCache = (api: any, maxAge = 10 * 60 * 1000) => {
  const state = api.getState();
  const apiState = state.api;

  // Remove entries older than maxAge
  Object.keys(apiState.queries).forEach(queryKey => {
    const query = apiState.queries[queryKey];
    if (query && Date.now() - query.fulfilledTimeStamp > maxAge) {
      api.dispatch(api.util.removeQueryData(queryKey));
    }
  });
};

// Export cache management hooks
export const useCacheManager = () => {
  return {
    invalidateEntity: (entityType: ApiTagTypes, entityId?: string) =>
      getInvalidationTags(entityType, 'update', entityId),

    getCacheConfig,
    createOptimisticUpdate,
    warmRelatedCache,
    cleanupStaleCache,
  };
};
