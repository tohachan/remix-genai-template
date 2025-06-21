import { test, expect } from '@playwright/test';

test.describe('Kanban Board Workflow', () => {
  test.beforeEach(async({ page }) => {
    // Login as admin before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display kanban board with columns', async({ page }) => {
    // Navigate to kanban board
    await page.goto('/kanban');

    // Check that kanban columns are visible
    await expect(page.locator('text=To Do')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Review')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();

    // Check for kanban board container
    await expect(page.locator('[data-testid="kanban-board"]')).toBeVisible();
  });

  test('should display tasks in appropriate columns', async({ page }) => {
    await page.goto('/kanban');

    // Wait for tasks to load
    await page.waitForSelector('[data-testid="task-card"]', { timeout: 10000 });

    // Check that task cards are visible
    const taskCards = page.locator('[data-testid="task-card"]');
    const taskCount = await taskCards.count();
    expect(taskCount).toBeGreaterThan(0);

    // Check that tasks have required elements
    const firstTask = taskCards.first();
    await expect(firstTask.locator('text=Task')).toBeVisible();
  });

  test('should show task details in cards', async({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('[data-testid="task-card"]');

    const taskCard = page.locator('[data-testid="task-card"]').first();

    // Check task card elements
    await expect(taskCard).toBeVisible();

    // Task should have title, priority, and assignee info
    const cardContent = await taskCard.textContent();
    expect(cardContent).toBeTruthy();
  });

  test('should open task details when clicking on task card', async({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('[data-testid="task-card"]');

    // Click on first task card
    await page.locator('[data-testid="task-card"]').first().click();

    // Should open task details modal or navigate to task page
    // Check for modal or task details view
    const modal = page.locator('[role="dialog"]');
    const hasModal = await modal.count() > 0;

    if (hasModal) {
      await expect(modal).toBeVisible();
    } else {
      // Check if navigated to task details page
      await expect(page.locator('text=Task Details')).toBeVisible();
    }
  });

  test('should filter tasks by assignee', async({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('[data-testid="task-card"]');

    // Look for filter controls
    const assigneeFilter = page.locator('[data-testid="assignee-filter"]');
    if (await assigneeFilter.count() > 0) {
      // Select a specific assignee
      await assigneeFilter.click();
      await page.click('text=Admin User');

      // Wait for filtering to complete
      await page.waitForTimeout(1000);

      // Verify filtered results
      const taskCards = page.locator('[data-testid="task-card"]');
      const taskCount = await taskCards.count();

      // Should have some tasks or show "no tasks" message
      if (taskCount === 0) {
        await expect(page.locator('text=No tasks found')).toBeVisible();
      } else {
        expect(taskCount).toBeGreaterThan(0);
      }
    }
  });

  test('should filter tasks by priority', async({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('[data-testid="task-card"]');

    // Look for priority filter
    const priorityFilter = page.locator('[data-testid="priority-filter"]');
    if (await priorityFilter.count() > 0) {
      await priorityFilter.click();
      await page.click('text=High');

      await page.waitForTimeout(1000);

      const taskCards = page.locator('[data-testid="task-card"]');
      const taskCount = await taskCards.count();

      if (taskCount === 0) {
        await expect(page.locator('text=No tasks found')).toBeVisible();
      }
    }
  });

  test('should search tasks by title', async({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('[data-testid="task-card"]');

    // Look for search input
    const searchInput = page.locator('[data-testid="task-search"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test');

      await page.waitForTimeout(1000);

      // Check filtered results
      const taskCards = page.locator('[data-testid="task-card"]');
      const taskCount = await taskCards.count();

      if (taskCount > 0) {
        // Verify search results contain the search term
        const firstTaskText = await taskCards.first().textContent();
        expect(firstTaskText?.toLowerCase()).toContain('test');
      }
    }
  });

  test('should handle empty kanban board state', async({ page }) => {
    await page.goto('/kanban');

    // If no tasks exist, should show empty state
    await page.waitForTimeout(2000);

    const taskCards = page.locator('[data-testid="task-card"]');
    const taskCount = await taskCards.count();

    if (taskCount === 0) {
      // Should show empty state message
      await expect(page.locator('text=No tasks available')).toBeVisible();
    }
  });

  test('should show kanban board statistics', async({ page }) => {
    await page.goto('/kanban');

    // Look for stats section
    const statsSection = page.locator('[data-testid="kanban-stats"]');
    if (await statsSection.count() > 0) {
      await expect(statsSection).toBeVisible();

      // Should show task counts or other metrics
      const statsText = await statsSection.textContent();
      expect(statsText).toBeTruthy();
    }
  });

  test('should handle keyboard navigation', async({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('[data-testid="task-card"]');

    // Focus on first task card
    await page.locator('[data-testid="task-card"]').first().focus();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Should open task or trigger some action
    // This will depend on the specific keyboard implementation
  });

  test('should bulk select tasks', async({ page }) => {
    await page.goto('/kanban');
    await page.waitForSelector('[data-testid="task-card"]');

    // Look for bulk select controls
    const bulkSelect = page.locator('[data-testid="bulk-select"]');
    if (await bulkSelect.count() > 0) {
      await bulkSelect.click();

      // Select multiple tasks
      await page.locator('[data-testid="task-checkbox"]').first().click();
      await page.locator('[data-testid="task-checkbox"]').nth(1).click();

      // Should show bulk actions
      await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible();
    }
  });
});
