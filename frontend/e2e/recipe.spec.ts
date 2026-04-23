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

  test("should update a recipe's title", async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByLabel('Recipe title').fill('Old Title');
    await page.getByRole('button', { name: 'Add Recipe' }).click();
    await expect(page.getByText('Old Title')).toBeVisible();

    await page.getByRole('button', { name: 'Update' }).click();
    await page.getByLabel('Update recipe title').fill('New Title');
    await page.getByRole('button', { name: 'Update Recipe' }).click();

    await expect(page.getByText('New Title')).toBeVisible();
    await expect(page.getByText('Old Title')).not.toBeVisible();
  });

  test('should close update form after submit', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByLabel('Recipe title').fill('Pasta');
    await page.getByRole('button', { name: 'Add Recipe' }).click();

    await page.getByRole('button', { name: 'Update' }).click();
    await page.getByLabel('Update recipe title').fill('Updated Pasta');
    await page.getByRole('button', { name: 'Update Recipe' }).click();

    await expect(page.getByLabel('Update recipe title')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
  });

  test('should close update form on cancel', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByLabel('Recipe title').fill('Pasta');
    await page.getByRole('button', { name: 'Add Recipe' }).click();

    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByLabel('Update recipe title')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByLabel('Update recipe title')).not.toBeVisible();
    await expect(page.getByText('Pasta')).toBeVisible();
  });

  test('should only show one update form at a time', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByLabel('Recipe title').fill('First Recipe');
    await page.getByRole('button', { name: 'Add Recipe' }).click();

    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByLabel('Recipe title').fill('Second Recipe');
    await page.getByRole('button', { name: 'Add Recipe' }).click();

    await page.getByTestId('recipe-1').getByRole('button', { name: 'Update' }).click();
    await expect(page.getByTestId('recipe-1').getByLabel('Update recipe title')).toBeVisible();

    await page.getByTestId('recipe-2').getByRole('button', { name: 'Update' }).click();
    await expect(page.getByTestId('recipe-1').getByLabel('Update recipe title')).not.toBeVisible();
    await expect(page.getByTestId('recipe-2').getByLabel('Update recipe title')).toBeVisible();
  });
});
