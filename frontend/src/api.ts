import type {
  ApiResponse,
  CreateRecipeDto,
  Ingredient,
  Recipe,
  UpdateRecipeDto,
} from '@app/shared';

const API_BASE = '/api/recipes';

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  const body = (await res.json()) as ApiResponse<Recipe[]>;
  return body.data;
}

export async function createRecipe(dto: CreateRecipeDto): Promise<Recipe> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  const body = (await res.json()) as ApiResponse<Recipe>;
  return body.data;
}

export async function updateRecipe(id: number, dto: UpdateRecipeDto): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/${id}`, {
    // MAYBE: Change to PATCH
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to update recipe');
  const body = (await res.json()) as ApiResponse<Recipe>;
  return body.data;
}

export async function deleteRecipe(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete recipe');
}

export async function fetchRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch recipe');
  const body = (await res.json()) as ApiResponse<Recipe>;
  return body.data;
}

export async function fetchIngredients(recipeId: number): Promise<Ingredient[]> {
  const res = await fetch(`${API_BASE}/${recipeId}/ingredients`);
  if (!res.ok) throw new Error('Failed to fetch ingredients');
  const body = (await res.json()) as ApiResponse<Ingredient[]>;
  return body.data;
}
