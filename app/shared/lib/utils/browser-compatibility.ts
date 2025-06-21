// Browser Compatibility Testing Utility
export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  isSupported: boolean;
  features: FeatureSupport;
}

export interface FeatureSupport {
  css: {
    flexbox: boolean;
    grid: boolean;
    customProperties: boolean;
    containerQueries: boolean;
  };
  javascript: {
    es6: boolean;
    modules: boolean;
    asyncAwait: boolean;
    intersectionObserver: boolean;
    webComponents: boolean;
  };
  apis: {
    fetch: boolean;
    webSockets: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    webWorkers: boolean;
    serviceWorkers: boolean;
  };
}

export interface CompatibilityTestResult {
  browser: BrowserInfo;
  issues: CompatibilityIssue[];
  recommendations: string[];
  score: number; // 0-100
}

export interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  feature: string;
  message: string;
  workaround?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Detect browser information
 */
export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor;

  let name = 'Unknown';
  let version = '0';
  let engine = 'Unknown';

  // Chrome
  if (userAgent.includes('Chrome') && vendor.includes('Google')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match?.[1] || '0';
    engine = 'Blink';
  }
  // Firefox
  else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match?.[1] || '0';
    engine = 'Gecko';
  }
  // Safari
  else if (userAgent.includes('Safari') && vendor.includes('Apple')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    version = match?.[1] || '0';
    engine = 'WebKit';
  }
  // Edge
  else if (userAgent.includes('Edg')) {
    name = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match?.[1] || '0';
    engine = 'Blink';
  }

  const features = checkFeatureSupport();
  const isSupported = checkBrowserSupport(name, parseInt(version));

  return {
    name,
    version,
    engine,
    isSupported,
    features,
  };
}

/**
 * Check browser support based on minimum requirements
 */
function checkBrowserSupport(name: string, version: number): boolean {
  const minimumVersions = {
    Chrome: 90,
    Firefox: 88,
    Safari: 14,
    Edge: 90,
  };

  const minVersion = minimumVersions[name as keyof typeof minimumVersions];
  return minVersion ? version >= minVersion : false;
}

/**
 * Check feature support for current browser
 */
export function checkFeatureSupport(): FeatureSupport {
  return {
    css: {
      flexbox: CSS.supports('display', 'flex'),
      grid: CSS.supports('display', 'grid'),
      customProperties: CSS.supports('--test', 'test'),
      containerQueries: CSS.supports('@container (width: 100px)'),
    },
    javascript: {
      es6: checkES6Support(),
      modules: 'noModule' in HTMLScriptElement.prototype,
      asyncAwait: checkAsyncAwaitSupport(),
      intersectionObserver: 'IntersectionObserver' in window,
      webComponents: 'customElements' in window,
    },
    apis: {
      fetch: 'fetch' in window,
      webSockets: 'WebSocket' in window,
      localStorage: checkLocalStorageSupport(),
      sessionStorage: checkSessionStorageSupport(),
      indexedDB: 'indexedDB' in window,
      webWorkers: 'Worker' in window,
      serviceWorkers: 'serviceWorker' in navigator,
    },
  };
}

/**
 * Check ES6 support
 */
function checkES6Support(): boolean {
  try {
    // Check for arrow functions, const/let, template literals
    new Function('const arrow = () => `template ${true}`;');
    return true;
  } catch {
    return false;
  }
}

/**
 * Check async/await support
 */
function checkAsyncAwaitSupport(): boolean {
  try {
    new Function('async function test() { await Promise.resolve(); }');
    return true;
  } catch {
    return false;
  }
}

/**
 * Check localStorage support with error handling
 */
function checkLocalStorageSupport(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check sessionStorage support with error handling
 */
function checkSessionStorageSupport(): boolean {
  try {
    const testKey = '__test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Run comprehensive browser compatibility test
 */
export function runCompatibilityTest(): CompatibilityTestResult {
  const browser = detectBrowser();
  const issues: CompatibilityIssue[] = [];
  const recommendations: string[] = [];

  // Check browser support
  if (!browser.isSupported) {
    issues.push({
      type: 'error',
      feature: 'Browser Version',
      message: `${browser.name} ${browser.version} is not supported. Please update to a newer version.`,
      severity: 'critical',
    });
    recommendations.push(`Update ${browser.name} to the latest version`);
  }

  // Check CSS features
  if (!browser.features.css.flexbox) {
    issues.push({
      type: 'error',
      feature: 'CSS Flexbox',
      message: 'Flexbox is not supported, layout may be broken',
      workaround: 'Use float-based layouts as fallback',
      severity: 'high',
    });
  }

  if (!browser.features.css.grid) {
    issues.push({
      type: 'warning',
      feature: 'CSS Grid',
      message: 'CSS Grid is not supported, some layouts may not work optimally',
      workaround: 'Use flexbox or float-based layouts',
      severity: 'medium',
    });
  }

  if (!browser.features.css.customProperties) {
    issues.push({
      type: 'warning',
      feature: 'CSS Custom Properties',
      message: 'CSS variables are not supported, theming may not work',
      workaround: 'Use Sass variables or PostCSS for preprocessing',
      severity: 'medium',
    });
  }

  // Check JavaScript features
  if (!browser.features.javascript.es6) {
    issues.push({
      type: 'error',
      feature: 'ES6 JavaScript',
      message: 'ES6 features are not supported',
      workaround: 'Use Babel transpilation',
      severity: 'high',
    });
  }

  if (!browser.features.javascript.asyncAwait) {
    issues.push({
      type: 'warning',
      feature: 'Async/Await',
      message: 'Async/await is not supported',
      workaround: 'Use Promises with .then() syntax',
      severity: 'medium',
    });
  }

  if (!browser.features.javascript.intersectionObserver) {
    issues.push({
      type: 'info',
      feature: 'Intersection Observer',
      message: 'Intersection Observer is not supported',
      workaround: 'Use scroll event listeners or polyfill',
      severity: 'low',
    });
  }

  // Check API features
  if (!browser.features.apis.fetch) {
    issues.push({
      type: 'warning',
      feature: 'Fetch API',
      message: 'Fetch API is not supported',
      workaround: 'Use XMLHttpRequest or a polyfill',
      severity: 'medium',
    });
  }

  if (!browser.features.apis.localStorage) {
    issues.push({
      type: 'warning',
      feature: 'localStorage',
      message: 'localStorage is not available',
      workaround: 'Use cookies or in-memory storage',
      severity: 'medium',
    });
  }

  if (!browser.features.apis.serviceWorkers) {
    issues.push({
      type: 'info',
      feature: 'Service Workers',
      message: 'Service Workers are not supported',
      workaround: 'PWA features will not be available',
      severity: 'low',
    });
  }

  // Add general recommendations
  if (browser.isSupported) {
    recommendations.push('Browser is supported, all core features should work');
  }

  if (issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0) {
    recommendations.push('Consider enabling advanced features for this browser');
  }

  // Calculate compatibility score
  const totalFeatures = Object.values(browser.features).reduce(
    (acc, category) => acc + Object.keys(category).length,
    0,
  );

  const supportedFeatures = Object.values(browser.features).reduce(
    (acc, category) => acc + Object.values(category).filter(Boolean).length,
    0,
  );

  const score = Math.round((supportedFeatures / totalFeatures) * 100);

  return {
    browser,
    issues,
    recommendations,
    score,
  };
}

/**
 * Log compatibility test results to console
 */
export function logCompatibilityTest(): void {
  const result = runCompatibilityTest();

  console.group('🌐 Browser Compatibility Report');
  console.log(`Browser: ${result.browser.name} ${result.browser.version} (${result.browser.engine})`);
  console.log(`Compatibility Score: ${result.score}/100`);
  console.log(`Supported: ${result.browser.isSupported ? '✅' : '❌'}`);

  if (result.issues.length > 0) {
    console.group('⚠️ Compatibility Issues');
    result.issues.forEach(issue => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${issue.feature}: ${issue.message}`);
      if (issue.workaround) {
        console.log(`   💡 Workaround: ${issue.workaround}`);
      }
    });
    console.groupEnd();
  }

  if (result.recommendations.length > 0) {
    console.group('💡 Recommendations');
    result.recommendations.forEach(rec => console.log(`• ${rec}`));
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Initialize browser compatibility monitoring
 */
export function initCompatibilityMonitoring(): void {
  // Run compatibility test on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logCompatibilityTest);
  } else {
    logCompatibilityTest();
  }

  // Add development shortcut
  if (process.env.NODE_ENV === 'development') {
    (window as any).__checkCompatibility = logCompatibilityTest;
    console.log('🔧 Development mode: Run __checkCompatibility() to test browser compatibility');
  }
}

/**
 * Cross-browser testing utilities for manual testing
 */
export const CrossBrowserTestingUtils = {
  /**
   * Test CSS feature support
   */
  testCSSFeature: (property: string, value: string): boolean => {
    return CSS.supports(property, value);
  },

  /**
   * Test JavaScript feature
   */
  testJSFeature: (code: string): boolean => {
    try {
      new Function(code);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get viewport information
   */
  getViewportInfo: () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    orientation: screen.orientation?.type || 'unknown',
  }),

  /**
   * Test touch support
   */
  hasTouchSupport: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Test for reduced motion preference
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Test for dark mode preference
   */
  prefersDarkMode: (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
};
