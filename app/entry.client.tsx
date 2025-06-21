import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { enableMocking } from '~/shared/lib/msw/browser';
import { initPerformanceMonitoring } from '~/shared/lib/utils/performance';
import { initAccessibilityMonitoring } from '~/shared/lib/utils/accessibility';
import { initCompatibilityMonitoring } from '~/shared/lib/utils/browser-compatibility';
import { initMobileTestingMonitoring } from '~/shared/lib/utils/mobile-testing';

// Enable MSW and wait for it to start, then start React app
async function startApp() {
  // Enable MSW in development
  await enableMocking();

  // Initialize all monitoring and testing systems
  initPerformanceMonitoring();
  initAccessibilityMonitoring();
  initCompatibilityMonitoring();
  initMobileTestingMonitoring();

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
