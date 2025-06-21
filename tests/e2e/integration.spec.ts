import { test, expect } from '@playwright/test';

test.describe('Cross-Feature Integration Workflows', () => {
  test.beforeEach(async({ page }) => {
    // Login as admin before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('complete project-to-task-to-kanban workflow', async({ page }) => {
    // Step 1: Create a new project
    await page.goto('/');

    // Navigate to projects if there's a dedicated projects page
    const projectsLink = page.locator('text=Projects');
    if (await projectsLink.count() > 0) {
      await projectsLink.click();
    }

    // Look for "Create Project" button
    const createProjectBtn = page.locator('text=Create Project');
    if (await createProjectBtn.count() > 0) {
      await createProjectBtn.click();

      // Fill project form
      await page.fill('input[name="name"]', 'Integration Test Project');
      await page.fill('textarea[name="description"]', 'Test project for integration testing');

      // Submit project creation
      await page.click('button[type="submit"]');

      // Verify project was created
      await expect(page.locator('text=Integration Test Project')).toBeVisible();
    }

    // Step 2: Create tasks for the project
    // Navigate to task management
    await page.goto('/');
    const tasksLink = page.locator('text=Tasks');
    if (await tasksLink.count() > 0) {
      await tasksLink.click();
    }

    // Create a new task
    const createTaskBtn = page.locator('text=Create Task');
    if (await createTaskBtn.count() > 0) {
      await createTaskBtn.click();

      // Fill task form
      await page.fill('input[name="title"]', 'Integration Test Task');
      await page.fill('textarea[name="description"]', 'Test task for integration workflow');

      // Select project if dropdown exists
      const projectSelect = page.locator('select[name="projectId"]');
      if (await projectSelect.count() > 0) {
        await projectSelect.selectOption({ label: 'Integration Test Project' });
      }

      // Set priority
      const prioritySelect = page.locator('select[name="priority"]');
      if (await prioritySelect.count() > 0) {
        await prioritySelect.selectOption('high');
      }

      // Submit task creation
      await page.click('button[type="submit"]');

      // Verify task was created
      await expect(page.locator('text=Integration Test Task')).toBeVisible();
    }

    // Step 3: Verify task appears in Kanban board
    await page.goto('/kanban');

    // Wait for kanban board to load
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 10000 });

    // Look for our created task in the kanban board
    await expect(page.locator('text=Integration Test Task')).toBeVisible();

    // Step 4: Move task through kanban columns (simulate workflow)
    const taskCard = page.locator('[data-testid="task-card"]').filter({ hasText: 'Integration Test Task' });
    if (await taskCard.count() > 0) {
      // Task should initially be in "To Do" column
      const toDoColumn = page.locator('[data-testid="kanban-column-todo"]');
      if (await toDoColumn.count() > 0) {
        await expect(toDoColumn.locator('text=Integration Test Task')).toBeVisible();
      }
    }
  });

  test('team creation and task assignment workflow', async({ page }) => {
    // Step 1: Create a team
    await page.goto('/teams');

    const createTeamBtn = page.locator('text=Create Team');
    if (await createTeamBtn.count() > 0) {
      await createTeamBtn.click();

      // Fill team form
      await page.fill('input[name="name"]', 'Integration Test Team');
      await page.fill('textarea[name="description"]', 'Test team for integration testing');

      // Submit team creation
      await page.click('button[type="submit"]');

      // Verify team was created
      await expect(page.locator('text=Integration Test Team')).toBeVisible();
    }

    // Step 2: Invite team members
    const inviteBtn = page.locator('text=Invite Member');
    if (await inviteBtn.count() > 0) {
      await inviteBtn.click();

      // Fill invitation form
      await page.fill('input[name="email"]', 'testmember@example.com');
      await page.fill('input[name="name"]', 'Test Member');

      // Select role
      const roleSelect = page.locator('select[name="role"]');
      if (await roleSelect.count() > 0) {
        await roleSelect.selectOption('member');
      }

      // Submit invitation
      await page.click('button[type="submit"]');

      // Verify member was invited
      await expect(page.locator('text=testmember@example.com')).toBeVisible();
    }

    // Step 3: Create task and assign to team member
    await page.goto('/kanban');

    const createTaskBtn = page.locator('text=Create Task');
    if (await createTaskBtn.count() > 0) {
      await createTaskBtn.click();

      // Fill task form with team assignment
      await page.fill('input[name="title"]', 'Team Task Integration Test');
      await page.fill('textarea[name="description"]', 'Task assigned to team member');

      // Assign to team member if assignee dropdown exists
      const assigneeSelect = page.locator('select[name="assigneeId"]');
      if (await assigneeSelect.count() > 0) {
        await assigneeSelect.selectOption({ label: 'Test Member' });
      }

      // Submit task creation
      await page.click('button[type="submit"]');

      // Verify task was created with assignment
      await expect(page.locator('text=Team Task Integration Test')).toBeVisible();
    }
  });

  test('calendar view integration with task deadlines', async({ page }) => {
    // Step 1: Create a task with deadline
    await page.goto('/kanban');

    const createTaskBtn = page.locator('text=Create Task');
    if (await createTaskBtn.count() > 0) {
      await createTaskBtn.click();

      // Fill task form with deadline
      await page.fill('input[name="title"]', 'Calendar Integration Task');
      await page.fill('textarea[name="description"]', 'Task with deadline for calendar testing');

      // Set deadline if date input exists
      const deadlineInput = page.locator('input[name="deadline"]');
      if (await deadlineInput.count() > 0) {
        // Set deadline to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        await deadlineInput.fill(formattedDate);
      }

      // Submit task creation
      await page.click('button[type="submit"]');

      // Verify task was created
      await expect(page.locator('text=Calendar Integration Task')).toBeVisible();
    }

    // Step 2: Check task appears in calendar view
    await page.goto('/calendar');

    // Wait for calendar to load
    await page.waitForTimeout(2000);

    // Look for our task in the calendar
    await expect(page.locator('text=Calendar Integration Task')).toBeVisible();
  });

  test('analytics integration with project and task data', async({ page }) => {
    // Step 1: Create project and tasks for analytics data
    // First ensure we have some data to analyze
    await page.goto('/kanban');

    // Create multiple tasks with different statuses
    const taskData = [
      { title: 'Analytics Task 1', status: 'todo' },
      { title: 'Analytics Task 2', status: 'inprogress' },
      { title: 'Analytics Task 3', status: 'done' },
    ];

    for (const task of taskData) {
      const createTaskBtn = page.locator('text=Create Task');
      if (await createTaskBtn.count() > 0) {
        await createTaskBtn.click();

        await page.fill('input[name="title"]', task.title);
        await page.fill('textarea[name="description"]', `Task for analytics testing - ${task.status}`);

        // Submit task creation
        await page.click('button[type="submit"]');

        await page.waitForTimeout(1000);
      }
    }

    // Step 2: Navigate to analytics and verify data visualization
    await page.goto('/analytics');

    // Wait for analytics to load
    await page.waitForTimeout(3000);

    // Check for analytics components
    const chartContainer = page.locator('[data-testid="analytics-chart"]');
    if (await chartContainer.count() > 0) {
      await expect(chartContainer).toBeVisible();
    }

    // Check for burndown chart
    const burndownChart = page.locator('text=Burndown Chart');
    if (await burndownChart.count() > 0) {
      await expect(burndownChart).toBeVisible();
    }

    // Check for team workload chart
    const workloadChart = page.locator('text=Team Workload');
    if (await workloadChart.count() > 0) {
      await expect(workloadChart).toBeVisible();
    }

    // Check for completion report
    const completionReport = page.locator('text=Task Completion');
    if (await completionReport.count() > 0) {
      await expect(completionReport).toBeVisible();
    }
  });

  test('playground feature generation workflow', async({ page }) => {
    // Navigate to playground
    await page.goto('/playground');

    // Check playground components
    await expect(page.locator('[data-testid="code-editor"]')).toBeVisible();
    await expect(page.locator('text=Run Rules')).toBeVisible();

    // Test rule runner
    await page.click('text=Run Rules');

    // Wait for rule results
    await page.waitForTimeout(2000);

    // Check for rule results display
    const ruleResults = page.locator('[data-testid="rule-results"]');
    if (await ruleResults.count() > 0) {
      await expect(ruleResults).toBeVisible();
    }

    // Test feature generation if available
    const featureGenerator = page.locator('[data-testid="feature-generator"]');
    if (await featureGenerator.count() > 0) {
      await expect(featureGenerator).toBeVisible();

      // Fill feature generation form
      const featureNameInput = page.locator('input[name="featureName"]');
      if (await featureNameInput.count() > 0) {
        await featureNameInput.fill('TestFeature');

        // Select template type
        const templateSelect = page.locator('select[name="templateType"]');
        if (await templateSelect.count() > 0) {
          await templateSelect.selectOption('crud-list');
        }

        // Generate feature
        await page.click('text=Generate Feature');

        // Wait for generation to complete
        await page.waitForTimeout(3000);

        // Check for success message
        await expect(page.locator('text=Feature generated successfully')).toBeVisible();
      }
    }
  });

  test('documentation navigation and live components', async({ page }) => {
    // Navigate to docs
    await page.goto('/docs');

    // Check docs navigation
    await expect(page.locator('text=Documentation')).toBeVisible();

    // Test navigation to different principle pages
    const principles = ['SRP', 'FSD', 'Design Tokens', 'Layered Separation'];

    for (const principle of principles) {
      const principleLink = page.locator(`text=${principle}`);
      if (await principleLink.count() > 0) {
        await principleLink.click();

        // Verify page loaded
        await expect(page.locator(`text=${principle}`)).toBeVisible();

        // Check for live component demos if they exist
        const componentDemo = page.locator('[data-testid="component-demo"]');
        if (await componentDemo.count() > 0) {
          await expect(componentDemo).toBeVisible();
        }

        // Go back to docs index
        await page.goto('/docs');
      }
    }
  });
});
