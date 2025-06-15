import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Enhanced base query with error handling and retry logic
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async(args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors (unauthorized)
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // Store the new token
      // api.dispatch(tokenReceived(refreshResult.data));

      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      // api.dispatch(loggedOut());
    }
  }

  return result;
};

/**
 * Transform response to extract data from standardized API response
 */
export const transformResponse = <T>(response: { data: T }) => response.data;

/**
 * Standard error transformer for consistent error handling
 */
export const transformErrorResponse = (response: any, meta: any, arg: any) => {
  if (response.status === 'FETCH_ERROR') {
    return { message: 'Network error. Please check your connection.' };
  }

  if (response.data?.message) {
    return { message: response.data.message };
  }

  return { message: 'An unexpected error occurred.' };
};
