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
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Auth', 'Profile', 'Project', 'Task'] as const,
  endpoints: () => ({}),
});

export type ApiTagTypes = 'User' | 'Auth' | 'Profile' | 'Project' | 'Task';
