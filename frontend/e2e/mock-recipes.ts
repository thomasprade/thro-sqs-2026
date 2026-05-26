import type { CreateRecipeDto, Ingredient, Recipe, UpdateRecipeDto } from '@app/shared';
import type { Page } from '@playwright/test';

function createRecipe(id: number, dto: CreateRecipeDto): Recipe {
  const timestamp = new Date().toISOString();
  return {
    id,
    title: dto.title,
    description: dto.description,
    author: dto.author,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

const defaultIngredients: Record<number, Ingredient[]> = {};

function createIngredientsForRecipe(recipeId: number): Ingredient[] {
  const timestamp = new Date().toISOString();
  return [
    {
      id: recipeId * 100 + 1,
      recipeId,
      name: 'Flour',
      amount: 200,
      unit: 'g',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: recipeId * 100 + 2,
      recipeId,
      name: 'Eggs',
      amount: 2,
      unit: 'pcs',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: recipeId * 100 + 3,
      recipeId,
      name: 'Milk',
      amount: 150,
      unit: 'ml',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

export async function installRecipeApiMock(page: Page): Promise<void> {
  const recipes: Recipe[] = [];
  let nextId = 1;

  await page.route('**/api/recipes/**', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    const ingredientsMatch = /^\/api\/recipes\/(\d+)\/ingredients$/.exec(pathname);
    const singleRecipeMatch = /^\/api\/recipes\/(\d+)$/.exec(pathname);

    if (request.method() === 'GET' && ingredientsMatch) {
      const recipeId = Number(ingredientsMatch[1]);
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) {
        await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
        return;
      }
      if (!defaultIngredients[recipeId]) {
        defaultIngredients[recipeId] = createIngredientsForRecipe(recipeId);
      }
      await route.fulfill({ json: { data: defaultIngredients[recipeId] } });
      return;
    }

    if (request.method() === 'GET' && singleRecipeMatch) {
      const id = Number(singleRecipeMatch[1]);
      const recipe = recipes.find((r) => r.id === id);
      if (!recipe) {
        await route.fulfill({ status: 404, json: { message: 'Recipe not found' } });
        return;
      }
      await route.fulfill({ json: { data: recipe } });
      return;
    }

    if (request.method() === 'PUT' && singleRecipeMatch) {
      const id = Number(singleRecipeMatch[1]);
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

    if (request.method() === 'DELETE' && singleRecipeMatch) {
      const id = Number(singleRecipeMatch[1]);
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

  await page.route('**/api/recipes', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());
    const collectionMatch = pathname === '/api/recipes';

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

    await route.fulfill({ status: 405, json: { message: 'Method not allowed' } });
  });
}
