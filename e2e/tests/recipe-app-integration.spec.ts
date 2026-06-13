import { expect, test } from '@playwright/test';

test.describe('Recipe App', () => {
  test('Integration Tests', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('testuser');
    await page.getByRole('textbox', { name: 'Username' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('testpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#root')).toContainText('Logout');
    await expect(page.getByRole('button', { name: 'New Recipe' })).toBeVisible();
    await page.getByRole('button', { name: 'New Recipe' }).click();
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('textbox', { name: 'Title' }).fill('Testrezept');
    await page.getByRole('textbox', { name: 'Title' }).press('Tab');
    await page.getByRole('textbox', { name: 'Description' }).fill('Testrezept');
    await page.getByRole('textbox', { name: 'Description' }).press('Tab');
    await page.getByRole('textbox', { name: 'Author' }).fill('testuser');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('cell', { name: 'Testrezept' }).first()).toContainText(
      'Testrezept',
    );
    await expect(page.getByRole('button', { name: 'Edit Testrezept' })).toBeVisible();
    await page.getByRole('cell', { name: 'Testrezept' }).first().click();
    await expect(page.getByTestId('back-button')).toBeVisible();
    await expect(page.getByTestId('edit-ingredients-toggle')).toBeVisible();
    await expect(page.getByTestId('no-ingredients')).toBeVisible();
    await page.getByTestId('edit-ingredients-toggle').click();
    await expect(page.getByTestId('add-ingredients-button')).toBeVisible();
    await expect(page.getByTestId('edit-ingredients-toggle')).toBeVisible();
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
    await expect(page.getByRole('cell', { name: 'Testzutat', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Testzutat2', exact: true })).toBeVisible();
    await page.getByTestId('edit-ingredients-toggle').click();
    await expect(page.getByTestId('edit-ingredients-toggle')).toBeVisible();
    await page.getByRole('spinbutton', { name: 'Portions' }).click();
    await page.getByRole('spinbutton', { name: 'Portions' }).click();
    await page.getByRole('spinbutton', { name: 'Portions' }).click();
    await page.getByRole('spinbutton', { name: 'Portions' }).click();
    await page.getByRole('spinbutton', { name: 'Portions' }).fill('10');
    await expect(page.getByRole('cell', { name: '20' })).toBeVisible();
  });
});
