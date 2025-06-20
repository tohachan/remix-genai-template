import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW worker for browser environment
export const worker = setupWorker(...handlers);

// Start MSW in development mode only (non-blocking)
export async function enableMocking(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  // Only enable MSW in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    // Start MSW and wait for it to be ready
    await worker.start({
      onUnhandledRequest: 'warn',
      quiet: false,
    });
    console.log('🚀 MSW started successfully');
    console.log('📋 Available endpoints:');
    console.log('  GET /api/tasks');
    console.log('  GET /api/projects');
    console.log('  POST /api/tasks');
    console.log('  POST /api/projects');
  } catch (error) {
    console.error('❌ Failed to start MSW:', error);
  }
}
