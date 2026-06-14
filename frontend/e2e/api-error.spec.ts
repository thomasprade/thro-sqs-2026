import { expect, test } from './coverage-fixture';

test.describe('API error snackbar', () => {
  test.beforeEach(async ({ page }) => {
    // Simulate a failing recipes endpoint (500) to trigger the api:error event
    await page.route('**/api/recipes', (route) => route.fulfill({ status: 500, body: '' }));
    await page.route('**/api/weather', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { temperature: 20, weatherCode: 0 } }),
      }),
    );
    await page.goto('/');
  });

  test('shows error snackbar when an API request fails', async ({ page }) => {
    await expect(page.getByText(/a request failed/i)).toBeVisible();
  });

  test('error snackbar can be closed', async ({ page }) => {
    await expect(page.getByText(/a request failed/i)).toBeVisible();
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByText(/a request failed/i)).not.toBeVisible();
  });
});
