/**
 * Accessibility testing and compliance utilities
 * Provides functions for auditing WCAG AA compliance
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: Element;
  rule: string;
  message: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

export interface AccessibilityAuditResult {
  issues: AccessibilityIssue[];
  passed: number;
  failed: number;
  warnings: number;
  score: number; // 0-100
}

/**
 * Check if element has sufficient color contrast
 */
export function checkColorContrast(element: Element): boolean {
  const computedStyle = window.getComputedStyle(element);
  const backgroundColor = computedStyle.backgroundColor;
  const color = computedStyle.color;

  // Skip if transparent or no background
  if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
    return true;
  }

  // This is a simplified contrast check
  // In production, you'd use a proper contrast ratio calculation
  const bgLuminance = getLuminance(backgroundColor);
  const textLuminance = getLuminance(color);
  const ratio = (Math.max(bgLuminance, textLuminance) + 0.05) / (Math.min(bgLuminance, textLuminance) + 0.05);

  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  const fontSize = parseFloat(computedStyle.fontSize);
  const requiredRatio = fontSize >= 18 || (fontSize >= 14 && computedStyle.fontWeight === 'bold') ? 3 : 4.5;

  return ratio >= requiredRatio;
}

/**
 * Simple luminance calculation (approximation)
 */
function getLuminance(color: string): number {
  // This is a simplified implementation
  // In production, use a proper color parsing library
  const rgb = color.match(/\d+/g);
  if (!rgb || rgb.length < 3) return 0.5;

  const [r, g, b] = rgb.map(Number);
  if (r === undefined || g === undefined || b === undefined) return 0.5;

  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );

  if (rs === undefined || gs === undefined || bs === undefined) return 0.5;
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check for missing alt attributes on images
 */
export function checkImageAltText(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const ariaLabel = img.getAttribute('aria-label');
    const ariaLabelledBy = img.getAttribute('aria-labelledby');

    if (!alt && !ariaLabel && !ariaLabelledBy) {
      issues.push({
        type: 'error',
        element: img,
        rule: 'WCAG 1.1.1',
        message: 'Image missing alt text or aria-label',
        severity: 'serious',
      });
    } else if (alt === '') {
      // Empty alt is okay for decorative images, but check if it should have description
      const role = img.getAttribute('role');
      if (role !== 'presentation' && role !== 'none') {
        issues.push({
          type: 'warning',
          element: img,
          rule: 'WCAG 1.1.1',
          message: 'Image has empty alt text but no decorative role',
          severity: 'moderate',
        });
      }
    }
  });

  return issues;
}

/**
 * Check for proper heading hierarchy
 */
export function checkHeadingHierarchy(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;

  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1));

    if (currentLevel > previousLevel + 1) {
      issues.push({
        type: 'error',
        element: heading,
        rule: 'WCAG 1.3.1',
        message: `Heading level ${currentLevel} skips levels (previous was h${previousLevel})`,
        severity: 'serious',
      });
    }

    previousLevel = currentLevel;
  });

  return issues;
}

/**
 * Check for keyboard accessibility
 */
export function checkKeyboardAccessibility(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex], [role="button"], [role="link"]');

  interactiveElements.forEach(element => {
    const tabIndex = element.getAttribute('tabindex');
    const isHidden = window.getComputedStyle(element).display === 'none' ||
                     window.getComputedStyle(element).visibility === 'hidden';

    // Check for positive tabindex (anti-pattern)
    if (tabIndex && parseInt(tabIndex) > 0) {
      issues.push({
        type: 'warning',
        element,
        rule: 'WCAG 2.4.3',
        message: 'Avoid positive tabindex values',
        severity: 'moderate',
      });
    }

    // Check if interactive element is focusable
    if (!isHidden && !element.hasAttribute('disabled')) {
      const isFocusable = element.matches(':focus') ||
                         tabIndex === '0' ||
                         ['button', 'a', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase());

      if (!isFocusable) {
        issues.push({
          type: 'error',
          element,
          rule: 'WCAG 2.1.1',
          message: 'Interactive element is not keyboard accessible',
          severity: 'serious',
        });
      }
    }
  });

  return issues;
}

/**
 * Check for proper ARIA labels and roles
 */
export function checkAriaLabels(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Check for elements with ARIA roles that need labels
  const elementsNeedingLabels = document.querySelectorAll('[role="button"], [role="link"], [role="tab"], [role="menuitem"]');

  elementsNeedingLabels.forEach(element => {
    const hasLabel = element.getAttribute('aria-label') ||
                    element.getAttribute('aria-labelledby') ||
                    element.textContent?.trim();

    if (!hasLabel) {
      issues.push({
        type: 'error',
        element,
        rule: 'WCAG 4.1.2',
        message: `Element with role="${element.getAttribute('role')}" needs accessible name`,
        severity: 'serious',
      });
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby') ||
                    document.querySelector(`label[for="${input.id}"]`) ||
                    input.closest('label');

    if (!hasLabel && input.getAttribute('type') !== 'hidden') {
      issues.push({
        type: 'error',
        element: input,
        rule: 'WCAG 1.3.1',
        message: 'Form input missing accessible label',
        severity: 'serious',
      });
    }
  });

  return issues;
}

/**
 * Check for sufficient focus indicators
 */
export function checkFocusIndicators(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex="0"]');

  focusableElements.forEach(element => {
    if (!(element instanceof HTMLElement)) return;

    // Simulate focus to check styles
    element.focus();
    const focusedStyle = window.getComputedStyle(element, ':focus');
    element.blur();

    // Check if there's a visible focus indicator
    const hasOutline = focusedStyle.outline !== 'none' && focusedStyle.outline !== '0';
    const hasBorder = focusedStyle.border !== focusedStyle.border; // Compare with non-focused
    const hasBoxShadow = focusedStyle.boxShadow !== 'none';

    if (!hasOutline && !hasBorder && !hasBoxShadow) {
      issues.push({
        type: 'warning',
        element,
        rule: 'WCAG 2.4.7',
        message: 'Focusable element may lack visible focus indicator',
        severity: 'moderate',
      });
    }
  });

  return issues;
}

/**
 * Run comprehensive accessibility audit
 */
export function runAccessibilityAudit(): AccessibilityAuditResult {
  const allIssues: AccessibilityIssue[] = [
    ...checkImageAltText(),
    ...checkHeadingHierarchy(),
    ...checkKeyboardAccessibility(),
    ...checkAriaLabels(),
    ...checkFocusIndicators(),
  ];

  // Add color contrast check for text elements
  const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a');
  textElements.forEach(element => {
    if (!checkColorContrast(element)) {
      allIssues.push({
        type: 'warning',
        element,
        rule: 'WCAG 1.4.3',
        message: 'Insufficient color contrast',
        severity: 'moderate',
      });
    }
  });

  const errors = allIssues.filter(issue => issue.type === 'error');
  const warnings = allIssues.filter(issue => issue.type === 'warning');

  // Calculate score (100 - penalty for issues)
  const errorPenalty = errors.length * 10;
  const warningPenalty = warnings.length * 3;
  const score = Math.max(0, 100 - errorPenalty - warningPenalty);

  return {
    issues: allIssues,
    passed: textElements.length - allIssues.length,
    failed: errors.length,
    warnings: warnings.length,
    score,
  };
}

/**
 * Log accessibility audit results
 */
export function logAccessibilityAudit(): void {
  const results = runAccessibilityAudit();

  console.group('♿ Accessibility Audit Results');
  console.log(`Score: ${results.score}/100`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Warnings: ${results.warnings}`);

  if (results.issues.length > 0) {
    console.group('Issues Found:');
    results.issues.forEach(issue => {
      const symbol = issue.type === 'error' ? '❌' : '⚠️';
      console.log(`${symbol} ${issue.rule}: ${issue.message}`);
      console.log('Element:', issue.element);
    });
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * Test keyboard navigation programmatically
 */
export function testKeyboardNavigation(): void {
  const focusableElements = Array.from(document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex="0"]',
  )).filter(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });

  console.group('⌨️ Keyboard Navigation Test');
  console.log(`Found ${focusableElements.length} focusable elements`);

  // Test tab order
  let currentIndex = 0;
  const testInterval = setInterval(() => {
    if (currentIndex >= focusableElements.length) {
      clearInterval(testInterval);
      console.log('✅ Keyboard navigation test completed');
      console.groupEnd();
      return;
    }

    const element = focusableElements[currentIndex] as HTMLElement;
    element.focus();
    console.log(`Tab ${currentIndex + 1}:`, element);
    currentIndex++;
  }, 500);
}

/**
 * Initialize accessibility monitoring in development
 */
export function initAccessibilityMonitoring(): void {
  if (process.env.NODE_ENV !== 'development') return;

  // Run audit after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      logAccessibilityAudit();
    }, 1000);
  });

  // Add keyboard shortcut to run audit (Ctrl+Shift+A)
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'A') {
      event.preventDefault();
      logAccessibilityAudit();
    }
  });
}
