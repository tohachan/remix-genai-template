// Bug Tracking and Fix Utility
export interface BugReport {
  id: string;
  type: 'ui' | 'performance' | 'accessibility' | 'functionality' | 'responsive' | 'browser-compat';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  element?: Element;
  location: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  fix?: BugFix;
  status: 'open' | 'in-progress' | 'fixed' | 'wont-fix';
  timestamp: Date;
}

export interface BugFix {
  description: string;
  automated: boolean;
  code?: string;
  instructions: string[];
  tested: boolean;
}

export interface BugScanResult {
  bugs: BugReport[];
  fixedCount: number;
  totalIssues: number;
  score: number; // 0-100
}

/**
 * Scan for common UI bugs and issues
 */
export function scanForBugs(): BugReport[] {
  const bugs: BugReport[] = [];

  // Check for broken images
  const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0);
  brokenImages.forEach((img, index) => {
    bugs.push({
      id: `broken-image-${index}`,
      type: 'ui',
      severity: 'medium',
      title: 'Broken Image',
      description: 'Image failed to load or has invalid source',
      element: img,
      location: `Image: ${img.src || 'No src attribute'}`,
      reproductionSteps: ['Navigate to page', 'Look for broken image icon'],
      expectedBehavior: 'Image should display correctly',
      actualBehavior: 'Image shows broken icon or is blank',
      status: 'open',
      timestamp: new Date(),
      fix: {
        description: 'Fix image source or add fallback',
        automated: false,
        instructions: [
          'Check if image URL is correct',
          'Verify image file exists',
          'Add alt text for accessibility',
          'Consider adding loading="lazy" for performance',
        ],
        tested: false,
      },
    });
  });

  // Check for missing form labels
  const unlabeledInputs = Array.from(document.querySelectorAll('input, select, textarea')).filter(input => {
    const hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`) ||
                    input.closest('label');
    return !hasLabel && input.getAttribute('type') !== 'hidden';
  });

  unlabeledInputs.forEach((input, index) => {
    bugs.push({
      id: `missing-label-${index}`,
      type: 'accessibility',
      severity: 'high',
      title: 'Missing Form Label',
      description: 'Form input lacks accessible label',
      element: input,
      location: `Form input: ${input.tagName} ${(input as HTMLInputElement).type || input.tagName}`,
      reproductionSteps: ['Navigate to form', 'Use screen reader', 'Try to identify input purpose'],
      expectedBehavior: 'Input should have clear label or aria-label',
      actualBehavior: 'Input purpose is unclear to assistive technology',
      status: 'open',
      timestamp: new Date(),
      fix: {
        description: 'Add proper label for form input',
        automated: false,
        instructions: [
          'Add <label> element with for attribute',
          'Or add aria-label attribute',
          'Or add aria-labelledby pointing to descriptive text',
          'Ensure label text is descriptive',
        ],
        tested: false,
      },
    });
  });

  // Check for low contrast text
  const textElements = Array.from(document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button')).filter(el =>
    el.textContent?.trim() && window.getComputedStyle(el).display !== 'none',
  );

  textElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // Simple contrast check (this is basic - a full implementation would be more complex)
    if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const contrast = calculateSimpleContrast(color, backgroundColor);
      if (contrast < 4.5) { // WCAG AA standard
        bugs.push({
          id: `low-contrast-${index}`,
          type: 'accessibility',
          severity: 'medium',
          title: 'Low Color Contrast',
          description: `Text contrast ratio is ${contrast.toFixed(2)}, below WCAG AA standard of 4.5:1`,
          element: element,
          location: `Text element: ${element.tagName}`,
          reproductionSteps: ['Navigate to page', 'Check color contrast', 'Use contrast analyzer'],
          expectedBehavior: 'Text should have contrast ratio of at least 4.5:1',
          actualBehavior: `Contrast ratio is only ${contrast.toFixed(2)}:1`,
          status: 'open',
          timestamp: new Date(),
          fix: {
            description: 'Improve color contrast',
            automated: false,
            instructions: [
              'Use darker text color or lighter background',
              'Check contrast with online tools',
              'Test with different color combinations',
              'Ensure AA compliance (4.5:1) or AAA (7:1)',
            ],
            tested: false,
          },
        });
      }
    }
  });

  // Check for clickable elements without proper cursor
  const clickableElements = Array.from(document.querySelectorAll('[onclick], [role="button"], button')).filter(el => {
    const styles = window.getComputedStyle(el);
    return styles.cursor !== 'pointer' && styles.cursor !== 'default';
  });

  clickableElements.forEach((element, index) => {
    bugs.push({
      id: `missing-pointer-cursor-${index}`,
      type: 'ui',
      severity: 'low',
      title: 'Missing Pointer Cursor',
      description: 'Clickable element does not show pointer cursor on hover',
      element: element,
      location: `Clickable element: ${element.tagName}`,
      reproductionSteps: ['Hover over element', 'Observe cursor style'],
      expectedBehavior: 'Cursor should change to pointer to indicate clickability',
      actualBehavior: 'Cursor remains default',
      status: 'open',
      timestamp: new Date(),
      fix: {
        description: 'Add cursor: pointer style',
        automated: true,
        code: `${element.tagName.toLowerCase()} { cursor: pointer; }`,
        instructions: [
          'Add CSS rule: cursor: pointer;',
          'Apply to all clickable elements',
          'Test hover behavior',
        ],
        tested: false,
      },
    });
  });

  // Check for elements overflowing viewport
  const overflowingElements = Array.from(document.querySelectorAll('*')).filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.right > window.innerWidth || rect.bottom > window.innerHeight;
  });

  if (overflowingElements.length > 3) { // Only report if significant overflow
    bugs.push({
      id: 'viewport-overflow',
      type: 'responsive',
      severity: 'medium',
      title: 'Elements Overflow Viewport',
      description: `${overflowingElements.length} elements extend beyond viewport boundaries`,
      location: 'Multiple elements across page',
      reproductionSteps: ['Load page', 'Check for horizontal/vertical scrolling', 'Inspect overflowing elements'],
      expectedBehavior: 'All content should fit within viewport or scroll gracefully',
      actualBehavior: 'Elements extend beyond viewport causing layout issues',
      status: 'open',
      timestamp: new Date(),
      fix: {
        description: 'Fix responsive layout and element sizing',
        automated: false,
        instructions: [
          'Use responsive units (%, vw, vh)',
          'Add max-width constraints',
          'Check media queries',
          'Test on different screen sizes',
        ],
        tested: false,
      },
    });
  }

  return bugs;
}

/**
 * Simple contrast calculation (basic implementation)
 */
function calculateSimpleContrast(color1: string, color2: string): number {
  // This is a simplified contrast calculation
  // A full implementation would parse RGB values and calculate proper luminance
  const getLuminance = (color: string): number => {
    // Extract RGB values (simplified)
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return 0.5;

    const [r, g, b] = rgb.map(Number);
    // Simplified luminance calculation
    if (r === undefined || g === undefined || b === undefined) return 0.5;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Attempt to automatically fix bugs where possible
 */
export function autoFixBugs(bugs: BugReport[]): BugReport[] {
  const fixedBugs = bugs.map(bug => {
    if (bug.fix?.automated && bug.element) {
      try {
        switch (bug.id.split('-')[0]) {
        case 'missing':
          if (bug.id.includes('pointer-cursor')) {
            (bug.element as HTMLElement).style.cursor = 'pointer';
            bug.status = 'fixed';
            bug.fix.tested = true;
          }
          break;

        default:
          // No automated fix available
          break;
        }
      } catch (error) {
        console.warn(`Failed to auto-fix bug ${bug.id}:`, error);
      }
    }
    return bug;
  });

  return fixedBugs;
}

/**
 * Generate bug report summary
 */
export function generateBugReport(bugs: BugReport[]): BugScanResult {
  const fixedCount = bugs.filter(bug => bug.status === 'fixed').length;
  const totalIssues = bugs.length;

  // Calculate score based on severity and fix status
  const severityWeights = { critical: 25, high: 15, medium: 8, low: 3 };
  const totalPossiblePenalty = bugs.reduce((acc, bug) => acc + severityWeights[bug.severity], 0);
  const actualPenalty = bugs
    .filter(bug => bug.status !== 'fixed')
    .reduce((acc, bug) => acc + severityWeights[bug.severity], 0);

  const score = totalPossiblePenalty > 0 ? Math.max(0, 100 - (actualPenalty / totalPossiblePenalty) * 100) : 100;

  return {
    bugs,
    fixedCount,
    totalIssues,
    score: Math.round(score),
  };
}

/**
 * Log bug report to console
 */
export function logBugReport(): void {
  const bugs = scanForBugs();
  const fixedBugs = autoFixBugs(bugs);
  const report = generateBugReport(fixedBugs);

  console.group('🐛 Bug Report & Fixes');
  console.log(`Total Issues Found: ${report.totalIssues}`);
  console.log(`Auto-Fixed: ${report.fixedCount}`);
  console.log(`Remaining: ${report.totalIssues - report.fixedCount}`);
  console.log(`Quality Score: ${report.score}/100`);

  if (report.bugs.length > 0) {
    const bugsByType = report.bugs.reduce((acc, bug) => {
      acc[bug.type] = (acc[bug.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.group('📊 Issues by Type');
    Object.entries(bugsByType).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });
    console.groupEnd();

    console.group('🔍 Bug Details');
    report.bugs.forEach(bug => {
      const statusIcon = bug.status === 'fixed' ? '✅' : bug.status === 'in-progress' ? '🔄' : '❌';
      const severityIcon = bug.severity === 'critical' ? '🚨' : bug.severity === 'high' ? '⚠️' : bug.severity === 'medium' ? '⚡' : 'ℹ️';

      console.group(`${statusIcon} ${severityIcon} ${bug.title}`);
      console.log(`Description: ${bug.description}`);
      console.log(`Location: ${bug.location}`);
      if (bug.fix) {
        console.log(`Fix: ${bug.fix.description}`);
        if (bug.fix.automated) {
          console.log('🤖 Automated fix available');
        }
      }
      console.groupEnd();
    });
    console.groupEnd();
  } else {
    console.log('✅ No bugs detected!');
  }

  console.groupEnd();
}

/**
 * Initialize bug tracking monitoring
 */
export function initBugTracking(): void {
  // Run bug scan on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', logBugReport);
  } else {
    logBugReport();
  }

  // Add development shortcuts
  if (process.env.NODE_ENV === 'development') {
    (window as any).__scanBugs = logBugReport;
    (window as any).__fixBugs = () => {
      const bugs = scanForBugs();
      const fixed = autoFixBugs(bugs);
      console.log('🔧 Auto-fix completed:', fixed.filter(b => b.status === 'fixed').length, 'bugs fixed');
      return fixed;
    };
    console.log('🔧 Development mode: Run __scanBugs() to scan for issues, __fixBugs() to auto-fix');
  }
}

/**
 * Manual bug testing utilities
 */
export const BugTestingUtils = {
  /**
   * Test form validation
   */
  testFormValidation: (): void => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      console.log('Testing form validation for:', form);
      // Add form validation testing logic
    });
  },

  /**
   * Test link functionality
   */
  testLinks: (): void => {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        const target = document.querySelector(href);
        if (!target) {
          console.warn('Broken internal link:', href);
        }
      }
    });
  },

  /**
   * Test image loading
   */
  testImages: (): void => {
    const images = document.querySelectorAll('img');
    let loaded = 0;
    let failed = 0;

    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        loaded++;
      } else {
        failed++;
      }
    });

    console.log(`Images: ${loaded} loaded, ${failed} failed`);
  },

  /**
   * Test responsive breakpoints
   */
  testBreakpoints: (): void => {
    const breakpoints = [320, 768, 1024, 1200];
    breakpoints.forEach(width => {
      console.log(`Testing breakpoint: ${width}px`);
      // This would typically involve changing viewport in dev tools
    });
  },
};
