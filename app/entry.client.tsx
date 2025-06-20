import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { enableMocking } from '~/shared/lib/msw/browser';

// Enable MSW in the background (non-blocking)
enableMocking();

// Start React app immediately
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
