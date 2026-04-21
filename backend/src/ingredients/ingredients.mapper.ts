import { Ingredient } from '@app/shared';
import { IngredientEntity } from './ingredient.entity';

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
