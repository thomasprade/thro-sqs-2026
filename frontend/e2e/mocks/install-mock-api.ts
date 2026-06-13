import type { Page } from '@playwright/test';
import { handleIngredientRoutes } from './ingredient-routes';
import { MockStore } from './mock-store';
import { handleRecipeRoutes } from './recipe-routes';

export async function installRecipeApiMock(page: Page): Promise<void> {
  const store = new MockStore();

  await page.route('**/api/weather', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { temperature: 20, weatherCode: 0 } }),
    }),
  );

  await page.route('**/api/recipes/**', (route) => {
    const { pathname } = new URL(route.request().url());

    if (/\/ingredients(\/\d+)?$/.test(pathname)) {
      return handleIngredientRoutes(route, store);
    }
    return handleRecipeRoutes(route, store);
  });

  await page.route('**/api/recipes', (route) => handleRecipeRoutes(route, store));
}
