import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from '../recipes/recipe.entity';
import { CreateIngredientDto } from './dto';
import { IngredientEntity } from './ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepo: Repository<IngredientEntity>,
    @InjectRepository(RecipeEntity)
    private readonly recipeRepo: Repository<RecipeEntity>,
  ) {}

  private async findRecipeOrThrow(recipeId: number): Promise<RecipeEntity> {
    const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
    if (!recipe) {
      throw new NotFoundException(`Recipe #${recipeId} not found`);
    }
    return recipe;
  }

  async getIngredients(recipeId: number): Promise<IngredientEntity[]> {
    await this.findRecipeOrThrow(recipeId);
    return this.ingredientRepo.find({
      where: { recipeId },
      order: { id: 'ASC' },
    });
  }

  async addIngredients(recipeId: number, dtos: CreateIngredientDto[]): Promise<IngredientEntity[]> {
    await this.findRecipeOrThrow(recipeId);

    const ingredients = this.ingredientRepo.create(
      dtos.map((dto) => ({
        recipeId,
        name: dto.name,
        amount: dto.amount,
        unit: dto.unit,
      })),
    );
    await this.ingredientRepo.save(ingredients);

    return this.getIngredients(recipeId);
  }
}
