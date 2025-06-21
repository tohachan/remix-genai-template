// Mobile Responsiveness Testing Utility
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  screenSize: string;
  orientation: 'portrait' | 'landscape' | 'unknown';
  touchSupport: boolean;
  pixelRatio: number;
  viewport: {
    width: number;
    height: number;
    availableWidth: number;
    availableHeight: number;
  };
}

export interface ResponsiveTestResult {
  device: DeviceInfo;
  issues: ResponsiveIssue[];
  recommendations: string[];
  score: number; // 0-100
}

export interface ResponsiveIssue {
  type: 'error' | 'warning' | 'info';
  element?: Element;
  rule: string;
  message: string;
  suggestion?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

// Default breakpoints (can be customized)
export const defaultBreakpoints: BreakpointConfig = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

/**
 * Detect device information
 */
export function detectDevice(): DeviceInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;

  // Determine device type based on screen size
  let type: DeviceInfo['type'] = 'unknown';
  let screenSize = 'unknown';

  if (width < defaultBreakpoints.mobile) {
    type = 'mobile';
    screenSize = width < 480 ? 'small-mobile' : 'mobile';
  } else if (width < defaultBreakpoints.tablet) {
    type = 'tablet';
    screenSize = 'tablet';
  } else {
    type = 'desktop';
    screenSize = width < defaultBreakpoints.desktop ? 'small-desktop' : 'desktop';
  }

  // Determine orientation
  let orientation: DeviceInfo['orientation'] = 'unknown';
  if (screen.orientation) {
    orientation = screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape';
  } else {
    orientation = height > width ? 'portrait' : 'landscape';
  }

  // Check touch support
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return {
    type,
    screenSize,
    orientation,
    touchSupport,
    pixelRatio,
    viewport: {
      width,
      height,
      availableWidth: screen.availWidth,
      availableHeight: screen.availHeight,
    },
  };
}

/**
 * Check responsive design elements
 */
export function checkResponsiveElements(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  const device = detectDevice();

  // Check viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    issues.push({
      type: 'error',
      rule: 'Viewport Meta Tag',
      message: 'Missing viewport meta tag for mobile responsiveness',
      suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      severity: 'critical',
    });
  } else {
    const content = viewportMeta.getAttribute('content');
    if (!content?.includes('width=device-width')) {
      issues.push({
        type: 'warning',
        rule: 'Viewport Configuration',
        message: 'Viewport meta tag does not include width=device-width',
        suggestion: 'Update viewport meta tag to include width=device-width',
        severity: 'high',
      });
    }
  }

  // Check for horizontal scrolling
  if (document.documentElement.scrollWidth > window.innerWidth) {
    issues.push({
      type: 'error',
      rule: 'Horizontal Overflow',
      message: 'Page has horizontal scrollbar, content overflows viewport',
      suggestion: 'Use responsive units and max-width properties',
      severity: 'high',
    });
  }

  // Check for fixed-width elements that may cause issues
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const width = computedStyle.width;

    // Check for large fixed widths on mobile
    if (device.type === 'mobile' && width.includes('px')) {
      const pixelWidth = parseInt(width.replace('px', ''));
      if (pixelWidth > device.viewport.width) {
        issues.push({
          type: 'warning',
          element,
          rule: 'Fixed Width Elements',
          message: `Element has fixed width (${width}) larger than viewport (${device.viewport.width}px)`,
          suggestion: 'Use relative units (%, vw) or max-width instead',
          severity: 'medium',
        });
      }
    }
  });

  return issues;
}

/**
 * Check touch interaction elements
 */
export function checkTouchInteractions(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  const device = detectDevice();

  if (!device.touchSupport) {
    return issues; // Skip touch checks for non-touch devices
  }

  // Check for minimum touch target sizes (44px recommended by Apple, 48dp by Google)
  const minTouchSize = 44;
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [onclick], [role="button"], [tabindex]',
  );

  interactiveElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    // Skip hidden elements
    if (rect.width === 0 || rect.height === 0 || computedStyle.display === 'none') {
      return;
    }

    if (rect.width < minTouchSize || rect.height < minTouchSize) {
      issues.push({
        type: 'warning',
        element,
        rule: 'Touch Target Size',
        message: `Touch target too small (${Math.round(rect.width)}x${Math.round(rect.height)}px). Minimum recommended is ${minTouchSize}x${minTouchSize}px`,
        suggestion: 'Increase padding or use min-width/min-height',
        severity: 'medium',
      });
    }

    // Check for adequate spacing between touch targets
    const siblings = Array.from(element.parentElement?.children || [])
      .filter(el => el !== element && el.tagName.toLowerCase() !== 'script');

    siblings.forEach(sibling => {
      const siblingRect = sibling.getBoundingClientRect();
      const distance = Math.min(
        Math.abs(rect.right - siblingRect.left),
        Math.abs(rect.left - siblingRect.right),
        Math.abs(rect.bottom - siblingRect.top),
        Math.abs(rect.top - siblingRect.bottom),
      );

      if (distance < 8 && distance > 0) { // 8px minimum spacing
        issues.push({
          type: 'info',
          element,
          rule: 'Touch Target Spacing',
          message: 'Touch targets are too close together (less than 8px spacing)',
          suggestion: 'Add margin or padding between interactive elements',
          severity: 'low',
        });
      }
    });
  });

  return issues;
}

/**
 * Check text readability on mobile
 */
export function checkMobileReadability(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  const device = detectDevice();

  if (device.type !== 'mobile') {
    return issues; // Only check on mobile devices
  }

  const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, td');

  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const fontSize = parseFloat(computedStyle.fontSize);

    // Check minimum font size for mobile (16px recommended)
    if (fontSize < 16 && element.textContent?.trim()) {
      issues.push({
        type: 'warning',
        element,
        rule: 'Mobile Font Size',
        message: `Font size too small for mobile (${fontSize}px). Minimum recommended is 16px`,
        suggestion: 'Use font-size: 16px or larger for body text on mobile',
        severity: 'medium',
      });
    }

    // Check line height for readability
    const lineHeight = computedStyle.lineHeight;
    if (lineHeight !== 'normal' && !lineHeight.includes('px')) {
      const lineHeightValue = parseFloat(lineHeight);
      if (lineHeightValue < 1.4) {
        issues.push({
          type: 'info',
          element,
          rule: 'Line Height',
          message: `Line height may be too tight (${lineHeight}). Recommended minimum is 1.4`,
          suggestion: 'Increase line-height to 1.4 or higher for better readability',
          severity: 'low',
        });
      }
    }
  });

  return issues;
}

/**
 * Check for mobile-specific performance issues
 */
export function checkMobilePerformance(): ResponsiveIssue[] {
  const issues: ResponsiveIssue[] = [];
  const device = detectDevice();

  // Check for large images that may impact mobile performance
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const rect = img.getBoundingClientRect();

    // Check if image is displayed much smaller than its natural size
    if (img.naturalWidth && img.naturalHeight) {
      const displaySize = rect.width * rect.height;
      const naturalSize = img.naturalWidth * img.naturalHeight;

      if (naturalSize > displaySize * 4) { // Image is 4x larger than needed
        issues.push({
          type: 'warning',
          element: img,
          rule: 'Image Optimization',
          message: `Image is much larger than display size (${img.naturalWidth}x${img.naturalHeight} vs ${Math.round(rect.width)}x${Math.round(rect.height)})`,
          suggestion: 'Use responsive images or smaller file sizes for mobile',
          severity: 'medium',
        });
      }
    }
  });

  // Check for excessive DOM elements that may slow mobile rendering
  const totalElements = document.querySelectorAll('*').length;
  if (totalElements > 1500) {
    issues.push({
      type: 'info',
      rule: 'DOM Complexity',
      message: `High number of DOM elements (${totalElements}). May impact mobile performance`,
      suggestion: 'Consider lazy loading or pagination for better mobile performance',
      severity: 'low',
    });
  }

  return issues;
}

/**
 * Run comprehensive mobile responsiveness test
 */
export function runMobileTest(): ResponsiveTestResult {
  const device = detectDevice();
  const issues: ResponsiveIssue[] = [];

  // Run all checks
  issues.push(...checkResponsiveElements());
  issues.push(...checkTouchInteractions());
  issues.push(...checkMobileReadability());
  issues.push(...checkMobilePerformance());

  const recommendations: string[] = [];

  // Add device-specific recommendations
  if (device.type === 'mobile') {
    recommendations.push('Optimize for mobile-first responsive design');
    if (device.touchSupport) {
      recommendations.push('Ensure all interactive elements are touch-friendly');
    }
  }

  if (device.pixelRatio > 2) {
    recommendations.push('Use high-resolution images for Retina displays');
  }

  if (issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0) {
    recommendations.push('Mobile experience is well optimized');
  }

  // Calculate score based on issues
  const weights = { critical: 25, high: 15, medium: 8, low: 3 };
  const penalty = issues.reduce((acc, issue) => acc + weights[issue.severity], 0);
  const score = Math.max(0, 100 - penalty);

  return {
    device,
    issues,
    recommendations,
    score,
  };
}

/**
 * Log mobile test results to console
 */
export function logMobileTest(): void {
  const result = runMobileTest();

  console.group('📱 Mobile Responsiveness Report');
  console.log(`Device Type: ${result.device.type}`);
  console.log(`Screen Size: ${result.device.screenSize}`);
  console.log(`Orientation: ${result.device.orientation}`);
  console.log(`Touch Support: ${result.device.touchSupport ? '✅' : '❌'}`);
  console.log(`Viewport: ${result.device.viewport.width}x${result.device.viewport.height}`);
  console.log(`Mobile Score: ${result.score}/100`);

  if (result.issues.length > 0) {
    console.group('📋 Mobile Issues');
    result.issues.forEach(issue => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${issue.rule}: ${issue.message}`);
      if (issue.suggestion) {
        console.log(`   💡 Suggestion: ${issue.suggestion}`);
      }
    });
    console.groupEnd();
  }

  if (result.recommendations.length > 0) {
    console.group('💡 Mobile Recommendations');
    result.recommendations.forEach(rec => console.log(`• ${rec}`));
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Initialize mobile testing monitoring
 */
export function initMobileTestingMonitoring(): void {
  // Run mobile test on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logMobileTest);
  } else {
    logMobileTest();
  }

  // Run test on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(logMobileTest, 500); // Delay to allow for orientation change
  });

  // Run test on resize (throttled)
  let resizeTimeout: NodeJS.Timeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(logMobileTest, 300);
  });

  // Add development shortcuts
  if (process.env.NODE_ENV === 'development') {
    (window as any).__checkMobile = logMobileTest;
    (window as any).__deviceInfo = detectDevice;
    console.log('🔧 Development mode: Run __checkMobile() to test mobile responsiveness');
  }
}

/**
 * Mobile testing utilities for manual testing
 */
export const MobileTestingUtils = {
  /**
   * Simulate different viewport sizes
   */
  simulateViewport: (width: number, height: number): void => {
    // This is for testing purposes only - actual viewport cannot be changed programmatically
    console.log(`📐 Simulating viewport: ${width}x${height}`);
    console.log('Note: Use browser dev tools to actually change viewport size');
  },

  /**
   * Check if element is in viewport
   */
  isInViewport: (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  },

  /**
   * Get touch event coordinates
   */
  getTouchCoordinates: (event: TouchEvent): { x: number; y: number } | null => {
    const touch = event.touches[0] || event.changedTouches[0];
    if (!touch) return null;
    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  },

  /**
   * Test swipe gestures
   */
  testSwipeGesture: (element: Element, direction: 'left' | 'right' | 'up' | 'down'): void => {
    console.log(`🔄 Testing ${direction} swipe on element:`, element);
    // Implementation would depend on gesture library used
  },

  /**
   * Check if device supports specific features
   */
  checkMobileFeatures: () => ({
    touch: 'ontouchstart' in window,
    orientation: 'orientation' in window,
    deviceMotion: 'DeviceMotionEvent' in window,
    deviceOrientation: 'DeviceOrientationEvent' in window,
    geolocation: 'geolocation' in navigator,
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
  }),
};
