import type { CreateIngredientDto, UpdateIngredientDto } from '@app/shared';
import type { Route } from '@playwright/test';
import type { MockStore } from './mock-store';

async function handleSingleIngredient(
  route: Route,
  store: MockStore,
  recipeId: number,
  ingredientId: number,
): Promise<void> {
  const method = route.request().method();

  if (method === 'PUT') {
    const dto = route.request().postDataJSON() as UpdateIngredientDto;
    const updated = store.updateIngredient(recipeId, ingredientId, dto);
    if (!updated) {
      await route.fulfill({ status: 404, json: { message: 'Ingredient not found' } });
      return;
    }
    await route.fulfill({ json: { data: updated } });
    return;
  }

  if (method === 'DELETE') {
    const deleted = store.deleteIngredient(recipeId, ingredientId);
    if (!deleted) {
      await route.fulfill({ status: 404, json: { message: 'Ingredient not found' } });
      return;
    }
    await route.fulfill({ json: { message: 'Ingredient deleted' } });
    return;
  }

  await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
}

async function handleIngredientCollection(
  route: Route,
  store: MockStore,
  recipeId: number,
): Promise<void> {
  const method = route.request().method();

  if (method === 'GET') {
    const ingredients = store.getIngredients(recipeId);
    if (!ingredients) {
      await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
      return;
    }
    await route.fulfill({ json: { data: ingredients } });
    return;
  }

  if (method === 'POST') {
    const dtos = route.request().postDataJSON() as CreateIngredientDto[];
    const ingredients = store.addIngredients(recipeId, dtos);
    await route.fulfill({ json: { data: ingredients } });
    return;
  }

  await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
}

export async function handleIngredientRoutes(route: Route, store: MockStore): Promise<void> {
  const { pathname } = new URL(route.request().url());

  const singleMatch = /^\/api\/recipes\/(\d+)\/ingredients\/(\d+)$/.exec(pathname);
  if (singleMatch) {
    await handleSingleIngredient(route, store, Number(singleMatch[1]), Number(singleMatch[2]));
    return;
  }

  const collectionMatch = /^\/api\/recipes\/(\d+)\/ingredients$/.exec(pathname);
  if (collectionMatch) {
    await handleIngredientCollection(route, store, Number(collectionMatch[1]));
  }
}
