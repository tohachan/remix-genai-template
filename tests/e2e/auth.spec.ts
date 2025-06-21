import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('should display login form', async({ page }) => {
    // Navigate to login page
    await page.click('text=Login');
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

    // Fill login form with admin credentials
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect and check success
    await page.waitForURL('/');
    await expect(page.locator('text=Admin User')).toBeVisible();

    // Check that protected routes are accessible
    await expect(page.locator('text=Teams')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
  });

  test('should login successfully with member credentials', async({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form with member credentials
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'user123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect and check success
    await page.waitForURL('/');
    await expect(page.locator('text=Regular User')).toBeVisible();
  });

  test('should show error for invalid credentials', async({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();

    // Should remain on login page
    await expect(page).toHaveURL('/login');
  });

  test('should logout successfully', async({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Click user menu and logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Should redirect to home and show login button
    await page.waitForURL('/');
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Admin User')).not.toBeVisible();
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
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Should redirect back to teams page
    await page.waitForURL('/teams');
    await expect(page.locator('text=Team Management')).toBeVisible();
  });

  test('should enforce role-based access control', async({ page }) => {
    // Login as member
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'user123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Member should not have access to admin-only features
    // Check if admin features are hidden or show access denied
    const teamsLink = page.locator('text=Teams');
    if (await teamsLink.isVisible()) {
      await teamsLink.click();
      await expect(page.locator('text=Access Denied')).toBeVisible();
    }
  });
});
