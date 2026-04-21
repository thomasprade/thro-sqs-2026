import { Recipe } from '@app/shared';
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
