import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base API configuration for RTK Query
 * Provides shared configuration for all API endpoints
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      // First try to get from localStorage (where it's actually stored)
      const token = localStorage.getItem('auth_token') || (getState() as any)?.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Auth', 'Profile', 'Project', 'Task', 'Team', 'TeamMember', 'TeamInvitation', 'Analytics'] as const,
  endpoints: () => ({}),
});

export type ApiTagTypes = 'User' | 'Auth' | 'Profile' | 'Project' | 'Task' | 'Team' | 'TeamMember' | 'TeamInvitation' | 'Analytics';
