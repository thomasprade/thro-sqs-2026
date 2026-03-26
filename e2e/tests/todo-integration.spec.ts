import { expect, test } from '@playwright/test';

const API_BASE = 'http://localhost:3000/api/todos';

test.describe.serial('Full-Stack Integration', () => {
  test.beforeEach(async () => {
    // Clean up all existing todos via the API for test isolation
    const res = await fetch(API_BASE);
    const { data: todos } = (await res.json()) as { data: { id: number }[] };
    await Promise.all(todos.map((t) => fetch(`${API_BASE}/${t.id}`, { method: 'DELETE' })));
  });

  test('should create, toggle, and delete a todo end-to-end', async ({ page }) => {
    await page.goto('/');

    // Verify app loads
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();

    // Create a todo
    const input = page.getByLabel('New todo title');
    await input.fill('Integration test todo');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Integration test todo')).toBeVisible();

    // Verify persistence — reload the page
    await page.reload();
    await expect(page.getByText('Integration test todo')).toBeVisible();

    // Toggle the todo
    const checkbox = page.getByLabel('Toggle Integration test todo');
    await expect(checkbox).not.toBeChecked();
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Delete the todo
    await page.getByLabel('Delete Integration test todo').click();
    await expect(page.getByText('Integration test todo')).not.toBeVisible();

    // Verify deletion persists
    await page.reload();
    await expect(page.getByText('Integration test todo')).not.toBeVisible();
  });

  test('should handle multiple todos', async ({ page }) => {
    await page.goto('/');

    const input = page.getByLabel('New todo title');

    // Create multiple todos
    await input.fill('First todo');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('First todo')).toBeVisible();

    await input.fill('Second todo');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Second todo')).toBeVisible();

    // Both should be visible
    await expect(page.getByText('First todo')).toBeVisible();
    await expect(page.getByText('Second todo')).toBeVisible();
  });

  test('should validate empty todo title', async ({ page }) => {
    await page.goto('/');

    const addButton = page.getByRole('button', { name: 'Add' });
    await expect(addButton).toBeDisabled();
  });
});
