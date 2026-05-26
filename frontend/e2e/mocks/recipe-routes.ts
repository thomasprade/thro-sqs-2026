import type { CreateRecipeDto, UpdateRecipeDto } from '@app/shared';
import type { Route } from '@playwright/test';
import type { MockStore } from './mock-store';

async function handleSingleRecipe(route: Route, store: MockStore, id: number): Promise<void> {
  const method = route.request().method();

  if (method === 'GET') {
    const recipe = store.getRecipe(id);
    if (!recipe) {
      await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
      return;
    }
    await route.fulfill({ json: { data: recipe } });
    return;
  }

  if (method === 'PUT') {
    const dto = route.request().postDataJSON() as UpdateRecipeDto;
    const recipe = store.updateRecipe(id, dto);
    if (!recipe) {
      await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
      return;
    }
    await route.fulfill({ json: { data: recipe } });
    return;
  }

  if (method === 'DELETE') {
    const deleted = store.deleteRecipe(id);
    if (!deleted) {
      await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
      return;
    }
    await route.fulfill({ status: 204, body: '' });
    return;
  }

  await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
}

async function handleRecipeCollection(route: Route, store: MockStore): Promise<void> {
  const request = route.request();

  if (request.method() === 'GET') {
    await route.fulfill({ json: { data: store.getAllRecipes() } });
    return;
  }

  if (request.method() === 'POST') {
    const dto = request.postDataJSON() as CreateRecipeDto;
    const recipe = store.addRecipe(dto);
    await route.fulfill({ json: { data: recipe } });
    return;
  }

  await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
}

export async function handleRecipeRoutes(route: Route, store: MockStore): Promise<void> {
  const { pathname } = new URL(route.request().url());
  const singleMatch = /^\/api\/recipes\/(\d+)$/.exec(pathname);

  if (singleMatch) {
    await handleSingleRecipe(route, store, Number(singleMatch[1]));
    return;
  }

  if (pathname === '/api/recipes') {
    await handleRecipeCollection(route, store);
    return;
  }

  await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
}
