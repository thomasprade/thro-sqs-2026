import { expect, test } from './coverage-fixture';
import { installRecipeApiMock } from './mock-recipes';

test.describe('Recipe App UI', () => {
  test.beforeEach(async ({ page }) => {
    await installRecipeApiMock(page);
    await page.goto('/');
  });

  test('should display the recipes heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible();
  });

  test('should show empty state initially', async ({ page }) => {
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('should add a new recipe', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByLabel('Recipe title').fill('Playwright Pasta');
    await page.getByRole('button', { name: 'Add Recipe' }).click();

    await expect(page.getByText('Playwright Pasta')).toBeVisible();
  });

  test('should delete a recipe', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByLabel('Recipe title').fill('Delete Me');
    await page.getByRole('button', { name: 'Add Recipe' }).click();
    await expect(page.getByText('Delete Me')).toBeVisible();

    await page.getByLabel('Delete Delete Me').click();
    await expect(page.getByText('Delete Me')).not.toBeVisible();
  });
});
