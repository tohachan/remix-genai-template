import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { enableMocking } from '~/shared/lib/msw/browser';

// Enable MSW and wait for it to start, then start React app
async function startApp() {
  // Enable MSW in development
  await enableMocking();

  // Start React app after MSW is ready
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });
}

startApp().catch(console.error);
