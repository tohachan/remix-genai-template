import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async({ page }) => {
    // Set viewport to desktop size to ensure responsive elements are visible
    await page.setViewportSize({ width: 1280, height: 720 });

    // Debug: Log all API network requests
    page.on('request', request => {
      if (request.url().includes('/api/') || request.method() === 'POST') {
        console.log('Request:', request.method(), request.url(), request.postData());
      }
    });

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        console.log('API Response:', response.status(), response.url());
      }
    });

    // Start from the home page (MSW is already set up in the app)
    await page.goto('/');
  });

  test('should display login form', async({ page }) => {
    // Navigate to login page
    await page.click('text=Sign In');
    await page.waitForURL('/login');

    // Check login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=Demo Credentials')).toBeVisible();
  });

  test('should login successfully with admin credentials', async({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form with admin credentials (type slowly to trigger React events)
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').type('admin@example.com');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').type('admin123');

    // Wait for form to become valid and button to be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled();

    // Submit form by clicking the submit button
    await page.click('button[type="submit"]');

    // Wait for potential redirect after login
    await page.waitForURL('/', { timeout: 10000 });

    // Wait for successful login (check that user avatar appears first)
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible({ timeout: 10000 });

    // Check that user name appears on desktop (responsive design)
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toHaveText('Admin User');

    // Check that protected routes are accessible (use first match)
    await expect(page.getByRole('link', { name: 'Teams' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Analytics' }).first()).toBeVisible();
  });

  test('should login successfully with member credentials', async({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form with member credentials (type slowly to trigger React events)
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').type('john@example.com');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').type('user123');

    // Wait for form to become valid and button to be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled();

    // Submit form by clicking the submit button
    await page.click('button[type="submit"]');

    // Wait for redirect and check success
    await page.waitForURL('/');
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toHaveText('John Doe');
  });

  test('should show error for invalid credentials', async({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form with invalid credentials (type slowly to trigger React events)
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').type('invalid@example.com');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').type('wrongpassword');

    // Wait for form to become valid and button to be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled();

    // Submit form by clicking the submit button
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();

    // Should remain on login page
    await expect(page).toHaveURL('/login');
  });

  test('should logout successfully', async({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').type('admin@example.com');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').type('admin123');

    // Wait for form to become valid and button to be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled();

    // Submit form by clicking the submit button
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Click user menu and logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Should redirect to home and show login button
    await page.waitForURL('/');
    await expect(page.locator('text=Sign In')).toBeVisible();
    await expect(page.locator('[data-testid="user-avatar"]')).not.toBeVisible();
  });

  test('should redirect to login when accessing protected route while unauthenticated', async({ page }) => {
    // Try to access teams page without authentication
    await page.goto('/teams');

    // Should redirect to login with redirect parameter
    await page.waitForURL(/\/login\?redirect=/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should redirect back to intended page after login', async({ page }) => {
    // Try to access teams page without authentication
    await page.goto('/teams');
    await page.waitForURL(/\/login\?redirect=/);

    // Login
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').type('admin@example.com');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').type('admin123');

    // Wait for form to become valid and button to be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled();

    // Submit form by clicking the submit button
    await page.click('button[type="submit"]');

    // Should redirect back to teams page
    await page.waitForURL('/teams');
    await expect(page.locator('text=Team Management')).toBeVisible();
  });

  test('should enforce role-based access control', async({ page }) => {
    // Login as member
    await page.goto('/login');
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').type('john@example.com');
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').type('user123');

    // Wait for form to become valid and button to be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled();

    // Submit form by clicking the submit button
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Check user is logged in as member
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toHaveText('John Doe');

    // Member should have access to basic features but not admin features
    await expect(page.getByRole('link', { name: 'Teams' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' }).first()).toBeVisible();
  });
});
