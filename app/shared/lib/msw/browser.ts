import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW worker for browser environment
export const worker = setupWorker(...handlers);

// Start MSW in development mode only (non-blocking)
export function enableMocking(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Only enable MSW in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Start MSW asynchronously without blocking hydration
  worker.start({
    onUnhandledRequest: 'bypass',
  }).then(() => {
    console.log('🚀 MSW started successfully');
  }).catch((error) => {
    console.error('Failed to start MSW:', error);
  });
}
