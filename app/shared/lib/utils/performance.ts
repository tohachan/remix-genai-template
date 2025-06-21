/**
 * Performance monitoring utilities
 * Provides functions for tracking application performance metrics
 */

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  bundleSize?: number;
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  const metrics: PerformanceMetrics = {
    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
  };

  // Web Vitals metrics if available
  try {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      metrics.firstContentfulPaint = fcpEntry.startTime;
    }

    // LCP from PerformanceObserver
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  } catch (error) {
    console.warn('Performance metrics collection failed:', error);
  }

  return metrics;
}

/**
 * Log performance metrics to console in development
 */
export function logPerformanceMetrics(): void {
  if (process.env.NODE_ENV !== 'development') return;

  const metrics = getPerformanceMetrics();

  console.group('🚀 Performance Metrics');
  console.log('Load Time:', `${metrics.loadTime.toFixed(2)}ms`);
  console.log('DOM Content Loaded:', `${metrics.domContentLoaded.toFixed(2)}ms`);

  if (metrics.firstContentfulPaint) {
    console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`);
  }

  if (metrics.largestContentfulPaint) {
    console.log('Largest Contentful Paint:', `${metrics.largestContentfulPaint.toFixed(2)}ms`);
  }

  console.groupEnd();
}

/**
 * Measure component render time
 */
export function measureRenderTime<T extends Record<string, unknown>>(
  componentName: string,
  renderFn: () => T,
): T {
  const startTime = performance.now();
  const result = renderFn();
  const endTime = performance.now();

  if (process.env.NODE_ENV === 'development') {
    console.log(`⏱️ ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Track bundle size information
 */
export function trackBundleSize(): void {
  if (typeof window === 'undefined') return;

  // Estimate bundle size from loaded scripts
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  let totalSize = 0;

  Promise.all(
    scripts.map(async(script) => {
      const src = (script as HTMLScriptElement).src;
      if (src && src.includes(window.location.origin)) {
        try {
          const response = await fetch(src, { method: 'HEAD' });
          const size = response.headers.get('content-length');
          if (size) {
            totalSize += parseInt(size, 10);
          }
        } catch (error) {
          console.warn('Failed to get bundle size for:', src);
        }
      }
    }),
  ).then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    }
  });
}

/**
 * Monitor memory usage
 */
export function getMemoryUsage(): { used: number; total: number } | null {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }

  const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;

  return {
    used: memory.usedJSHeapSize / 1024 / 1024, // MB
    total: memory.totalJSHeapSize / 1024 / 1024, // MB
  };
}

/**
 * Track long tasks that block the main thread
 */
export function trackLongTasks(): void {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    console.warn('Long task tracking not supported');
  }
}

/**
 * Performance monitoring hook for React components
 */
export function usePerformanceMonitoring(componentName: string): void {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 ${componentName} lifecycle: ${(endTime - startTime).toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Log initial metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      logPerformanceMetrics();
      trackBundleSize();
      trackLongTasks();
    }, 100);
  });

  // Monitor memory usage periodically in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const memory = getMemoryUsage();
      if (memory && memory.used > 50) { // Alert if using more than 50MB
        console.warn(`💾 Memory usage: ${memory.used.toFixed(2)}MB / ${memory.total.toFixed(2)}MB`);
      }
    }, 30000); // Check every 30 seconds
  }
}

// Global React import for hook
declare const React: typeof import('react');
