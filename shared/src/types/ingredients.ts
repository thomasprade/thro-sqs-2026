export interface Ingredient {
  id: number;
  recipeId: number;
  name: string;
  amount: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientDto {
  name: string;
  amount: number;
  unit: string;
}

export interface UpdateIngredientDto {
  name?: string;
  amount?: number;
  unit?: string;
}
