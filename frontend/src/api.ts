import type {
  ApiResponse,
  CreateIngredientDto,
  CreateRecipeDto,
  Ingredient,
  Recipe,
  UpdateIngredientDto,
  UpdateRecipeDto,
  Weather,
} from '@app/shared';

const API_BASE = '/api/recipes';
const TOKEN_KEY = 'auth_token';

async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    globalThis.dispatchEvent(new Event('auth:unauthorized'));
  }
  return res;
}

export async function loginRequest(username: string, password: string): Promise<string> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const body = (await res.json()) as { access_token: string };
  return body.access_token;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await apiFetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  const body = (await res.json()) as ApiResponse<Recipe[]>;
  return body.data;
}

export async function createRecipe(dto: CreateRecipeDto): Promise<Recipe> {
  const res = await apiFetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to create recipe');
  const body = (await res.json()) as ApiResponse<Recipe>;
  return body.data;
}

export async function updateRecipe(id: number, dto: UpdateRecipeDto): Promise<Recipe> {
  const res = await apiFetch(`${API_BASE}/${id}`, {
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
  const res = await apiFetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete recipe');
}

export async function fetchRecipe(id: number): Promise<Recipe> {
  const res = await apiFetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch recipe');
  const body = (await res.json()) as ApiResponse<Recipe>;
  return body.data;
}

export async function fetchIngredients(recipeId: number): Promise<Ingredient[]> {
  const res = await apiFetch(`${API_BASE}/${recipeId}/ingredients`);
  if (!res.ok) throw new Error('Failed to fetch ingredients');
  const body = (await res.json()) as ApiResponse<Ingredient[]>;
  return body.data;
}

export async function addIngredients(
  recipeId: number,
  dtos: CreateIngredientDto[],
): Promise<Ingredient[]> {
  const res = await apiFetch(`${API_BASE}/${recipeId}/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dtos),
  });
  if (!res.ok) throw new Error('Failed to add ingredients');
  const body = (await res.json()) as ApiResponse<Ingredient[]>;
  return body.data;
}

export async function updateIngredient(
  recipeId: number,
  ingredientId: number,
  dto: UpdateIngredientDto,
): Promise<Ingredient> {
  const res = await apiFetch(`${API_BASE}/${recipeId}/ingredients/${ingredientId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to update ingredient');
  const body = (await res.json()) as ApiResponse<Ingredient>;
  return body.data;
}

export async function deleteIngredient(recipeId: number, ingredientId: number): Promise<void> {
  const res = await apiFetch(`${API_BASE}/${recipeId}/ingredients/${ingredientId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete ingredient');
}

export async function getWeather(): Promise<Weather> {
  const res = await apiFetch('/api/weather');
  if (!res.ok) throw new Error('Failed to fetch weather');
  const body = (await res.json()) as ApiResponse<Weather>;
  return body.data;
}
