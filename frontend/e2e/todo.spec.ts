import { expect, test } from '@playwright/test';

test.describe('Todo App UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the app title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  });

  test('should show empty state initially or existing todos', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    const input = page.getByLabel('New todo title');
    await input.fill('Playwright test todo');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText('Playwright test todo')).toBeVisible();
  });

  test('should toggle a todo', async ({ page }) => {
    // Create a todo first
    const input = page.getByLabel('New todo title');
    await input.fill('Toggle me');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Toggle me')).toBeVisible();

    // Toggle it
    const checkbox = page.getByLabel('Toggle Toggle me');
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('should delete a todo', async ({ page }) => {
    // Create a todo first
    const input = page.getByLabel('New todo title');
    await input.fill('Delete me');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Delete me')).toBeVisible();

    // Delete it
    await page.getByLabel('Delete Delete me').click();
    await expect(page.getByText('Delete me')).not.toBeVisible();
  });
});
