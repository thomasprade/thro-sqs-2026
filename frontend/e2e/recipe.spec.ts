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
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Playwright Pasta');
    await dialog.getByLabel('Description').fill('A simple dish');
    await dialog.getByLabel('Author').fill('Doe');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Playwright Pasta')).toBeVisible();
  });

  test('should delete a recipe', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Delete Me');
    await dialog.getByLabel('Description').fill('Please');
    await dialog.getByLabel('Author').fill('I can not do this anymore');
    await dialog.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Delete Me')).toBeVisible();

    await page.getByLabel('Delete Delete Me').click();
    await expect(page.getByText('Delete Me')).not.toBeVisible();
  });

  test("should update a recipe's title", async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    let dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Old Title');
    await dialog.getByLabel('Description').fill('A simple dish');
    await dialog.getByLabel('Author').fill('Doe');
    await dialog.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Old Title')).toBeVisible();

    await page.getByLabel('Edit Old Title').click();
    dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('New Title');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('New Title')).toBeVisible();
    await expect(page.getByText('Old Title')).not.toBeVisible();
  });

  test('should close dialog after save', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Pasta');
    await dialog.getByLabel('Description').fill('A simple dish');
    await dialog.getByLabel('Author').fill('Doe');
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close dialog on cancel when no changes', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should show unsaved changes warning when cancelling with dirty fields', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Something');
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('heading', { name: 'Unsaved Changes' })).toBeVisible();
  });

  test('should discard changes when clicking Discard in warning', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Something');
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should keep editing when clicking Keep Editing in warning', async ({ page }) => {
    await page.getByRole('button', { name: 'New Recipe' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Something');
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: 'Keep Editing' }).click();
    await expect(page.getByRole('heading', { name: 'Unsaved Changes' })).not.toBeVisible();
    await expect(dialog.getByLabel('Title')).toHaveValue('Something');
  });
});

test.describe('Recipe Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await installRecipeApiMock(page);
    await page.goto('/');

    // Create a recipe to navigate to
    await page.getByRole('button', { name: 'New Recipe' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Title').fill('Test Recipe');
    await dialog.getByLabel('Description').fill('A delicious test recipe');
    await dialog.getByLabel('Author').fill('Test Chef');
    await dialog.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Test Recipe', { exact: true })).toBeVisible();
  });

  test('should navigate to recipe detail page when clicking a recipe row', async ({ page }) => {
    await page.getByTestId('recipe-1').click();
    await expect(page.getByRole('heading', { name: 'Test Recipe' })).toBeVisible();
    await expect(page.getByText('A delicious test recipe')).toBeVisible();
  });

  test('should display ingredients with amounts and units', async ({ page }) => {
    await page.getByTestId('recipe-1').click();
    await expect(page.getByText('Flour')).toBeVisible();
    await expect(page.getByText('Eggs')).toBeVisible();
    await expect(page.getByText('Milk')).toBeVisible();
    await expect(
      page.getByTestId('ingredient-101').getByRole('cell', { name: '200' }),
    ).toBeVisible();
    await expect(page.getByTestId('ingredient-101').getByRole('cell', { name: 'g' })).toBeVisible();
  });

  test('should update ingredient amounts when changing portion size', async ({ page }) => {
    await page.getByTestId('recipe-1').click();
    await expect(page.getByText('Flour')).toBeVisible();

    const portionsInput = page.getByTestId('portions-input').locator('input');
    await portionsInput.fill('2');

    await expect(
      page.getByTestId('ingredient-101').getByRole('cell', { name: '400' }),
    ).toBeVisible();
    await expect(page.getByTestId('ingredient-102').getByRole('cell', { name: '4' })).toBeVisible();
    await expect(
      page.getByTestId('ingredient-103').getByRole('cell', { name: '300' }),
    ).toBeVisible();
  });

  test('should navigate back to home when clicking back button', async ({ page }) => {
    await page.getByTestId('recipe-1').click();
    await expect(page.getByRole('heading', { name: 'Test Recipe' })).toBeVisible();

    await page.getByTestId('back-button').click();
    await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible();
  });
});
