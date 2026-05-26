import type {
  CreateIngredientDto,
  CreateRecipeDto,
  Ingredient,
  Recipe,
  UpdateIngredientDto,
  UpdateRecipeDto,
} from '@app/shared';

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

export class MockStore {
  private recipes: Recipe[] = [];
  private ingredients: Record<number, Ingredient[]> = {};
  private nextRecipeId = 1;
  private nextIngredientId = 1000;

  getAllRecipes(): Recipe[] {
    return this.recipes;
  }

  getRecipe(id: number): Recipe | undefined {
    return this.recipes.find((r) => r.id === id);
  }

  addRecipe(dto: CreateRecipeDto): Recipe {
    const timestamp = new Date().toISOString();
    const recipe: Recipe = {
      id: this.nextRecipeId++,
      title: dto.title,
      description: dto.description,
      author: dto.author,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.recipes.unshift(recipe);
    return recipe;
  }

  updateRecipe(id: number, dto: UpdateRecipeDto): Recipe | undefined {
    const index = this.recipes.findIndex((r) => r.id === id);
    if (index === -1) return undefined;
    this.recipes[index] = { ...this.recipes[index], ...dto, updatedAt: new Date().toISOString() };
    return this.recipes[index];
  }

  deleteRecipe(id: number): boolean {
    const index = this.recipes.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.recipes.splice(index, 1);
    return true;
  }

  getIngredients(recipeId: number): Ingredient[] | undefined {
    if (!this.getRecipe(recipeId)) return undefined;
    if (!this.ingredients[recipeId]) {
      this.ingredients[recipeId] = createIngredientsForRecipe(recipeId);
    }
    return this.ingredients[recipeId];
  }

  addIngredients(recipeId: number, dtos: CreateIngredientDto[]): Ingredient[] {
    if (!this.ingredients[recipeId]) {
      this.ingredients[recipeId] = createIngredientsForRecipe(recipeId);
    }
    const timestamp = new Date().toISOString();
    for (const dto of dtos) {
      this.ingredients[recipeId].push({
        id: this.nextIngredientId++,
        recipeId,
        name: dto.name,
        amount: dto.amount,
        unit: dto.unit,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
    return this.ingredients[recipeId];
  }

  updateIngredient(
    recipeId: number,
    ingredientId: number,
    dto: UpdateIngredientDto,
  ): Ingredient | undefined {
    if (!this.ingredients[recipeId]) return undefined;
    const index = this.ingredients[recipeId].findIndex((i) => i.id === ingredientId);
    if (index === -1) return undefined;
    this.ingredients[recipeId][index] = {
      ...this.ingredients[recipeId][index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return this.ingredients[recipeId][index];
  }

  deleteIngredient(recipeId: number, ingredientId: number): boolean {
    if (!this.ingredients[recipeId]) return false;
    const index = this.ingredients[recipeId].findIndex((i) => i.id === ingredientId);
    if (index === -1) return false;
    this.ingredients[recipeId].splice(index, 1);
    return true;
  }
}
