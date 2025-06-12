import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api';

/**
 * Redux store configuration with RTK Query
 * Configured for client-side usage with automatic refetching
 */
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['api/executeQuery/pending', 'api/executeQuery/fulfilled'],
      },
    }).concat(baseApi.middleware),
});

// Enable refetch on focus/reconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export API utilities for convenience
export { baseApi };
export type { ApiTagTypes } from './api'; 