import { expect, test } from '@playwright/test';

test.describe('Recipe App', () => {
  test('Integration Tests', async ({ page }) => {
    // Navigate to the app and verify the empty state is shown, i.e. no recipes exist yet
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('empty-state')).toBeVisible();

    // Log in with the test user created in global setup
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('testuser');
    await page.getByRole('textbox', { name: 'Username' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('testpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify login was successful by checking for the presence of the Logout button and New Recipe button
    await expect(page.locator('#root')).toContainText('Logout');
    await expect(page.getByRole('button', { name: 'New Recipe' })).toBeVisible();

    // Create a new recipe
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Testrezept');
    await page.getByRole('textbox', { name: 'Title' }).press('Tab');
    await page.getByRole('textbox', { name: 'Description' }).fill('Testrezept');
    await page.getByRole('textbox', { name: 'Description' }).press('Tab');
    await page.getByRole('textbox', { name: 'Author' }).fill('testuser');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the new recipe appears in the list with correct title and description
    await expect(page.getByRole('cell', { name: 'Testrezept' }).first()).toContainText(
      'Testrezept',
    );
    await expect(page.getByRole('button', { name: 'Edit Testrezept' })).toBeVisible();

    // Click on the recipe to view details and verify the details are correct
    await page.getByRole('cell', { name: 'Testrezept' }).first().click();
    await expect(page.getByTestId('back-button')).toBeVisible();
    await expect(page.getByTestId('edit-ingredients-toggle')).toBeVisible();
    await expect(page.getByTestId('no-ingredients')).toBeVisible();
    await page.getByTestId('edit-ingredients-toggle').click();
    await expect(page.getByTestId('add-ingredients-button')).toBeVisible();
    await expect(page.getByTestId('edit-ingredients-toggle')).toBeVisible();

    // Add ingredients to the recipe
    await page.getByTestId('add-ingredients-button').click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Testzutat');
    await page.getByRole('textbox', { name: 'Name' }).press('Tab');
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('1');
    await page.getByRole('spinbutton', { name: 'Amount' }).press('Tab');
    await page.getByRole('textbox', { name: 'Unit' }).fill('Stück');
    await page.getByTestId('add-another-row').click();
    await page.getByTestId('ingredient-name-1').getByRole('textbox', { name: 'Name' }).click();
    await page
      .getByTestId('ingredient-name-1')
      .getByRole('textbox', { name: 'Name' })
      .fill('Testzutat2');
    await page.getByTestId('ingredient-name-1').getByRole('textbox', { name: 'Name' }).press('Tab');
    await page
      .getByTestId('ingredient-amount-1')
      .getByRole('spinbutton', { name: 'Amount' })
      .fill('2');
    await page
      .getByTestId('ingredient-amount-1')
      .getByRole('spinbutton', { name: 'Amount' })
      .press('Tab');
    await page
      .getByTestId('ingredient-unit-1')
      .getByRole('textbox', { name: 'Unit' })
      .fill('Stück');
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the ingredients are displayed correctly in the recipe details
    await expect(page.getByRole('cell', { name: 'Testzutat', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Testzutat2', exact: true })).toBeVisible();
    await page.getByTestId('edit-ingredients-toggle').click();
    await expect(page.getByTestId('edit-ingredients-toggle')).toBeVisible();

    // Verify that portions correctly multiply ingredient amounts
    await page.getByRole('spinbutton', { name: 'Portions' }).fill('10');
    await expect(page.getByRole('cell', { name: '20' })).toBeVisible();
  });
});
