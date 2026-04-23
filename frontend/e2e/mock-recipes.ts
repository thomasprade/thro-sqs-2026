import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '@app/shared';
import type { Page } from '@playwright/test';

function createRecipe(id: number, dto: CreateRecipeDto): Recipe {
  const timestamp = new Date().toISOString();
  return {
    id,
    title: dto.title,
    description: dto.description ?? '',
    author: dto.author ?? '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function installRecipeApiMock(page: Page): Promise<void> {
  const recipes: Recipe[] = [];
  let nextId = 1;

  await page.route('**/api/recipes**', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());
    const collectionMatch = pathname === '/api/recipes';
    const recipeIdMatch = /^\/api\/recipes\/(\d+)$/.exec(pathname);

    if (request.method() === 'GET' && collectionMatch) {
      await route.fulfill({ json: { data: recipes } });
      return;
    }

    if (request.method() === 'POST' && collectionMatch) {
      const dto = request.postDataJSON() as CreateRecipeDto;
      const recipe = createRecipe(nextId++, dto);
      recipes.unshift(recipe);
      await route.fulfill({ json: { data: recipe } });
      return;
    }

    if (request.method() === 'PUT' && recipeIdMatch) {
      const id = Number(recipeIdMatch[1]);
      const index = recipes.findIndex((r) => r.id === id);
      if (index === -1) {
        await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
        return;
      }
      const dto = request.postDataJSON() as UpdateRecipeDto;
      recipes[index] = { ...recipes[index], ...dto, updatedAt: new Date().toISOString() };
      await route.fulfill({ json: { data: recipes[index] } });
      return;
    }

    if (request.method() === 'DELETE' && recipeIdMatch) {
      const id = Number(recipeIdMatch[1]);
      const index = recipes.findIndex((r) => r.id === id);
      if (index === -1) {
        await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
        return;
      }
      recipes.splice(index, 1);
      await route.fulfill({ status: 204, body: '' });
      return;
    }

    await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
  });
}
