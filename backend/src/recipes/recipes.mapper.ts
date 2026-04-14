import { Ingredient, Recipe } from '@app/shared';
import { IngredientEntity } from './ingredient.entity';
import { RecipeEntity } from './recipe.entity';

export function toRecipe(entity: RecipeEntity): Recipe {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    author: entity.author,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toIngredient(entity: IngredientEntity): Ingredient {
  return {
    id: entity.id,
    recipeId: entity.recipeId,
    name: entity.name,
    amount: entity.amount,
    unit: entity.unit,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
