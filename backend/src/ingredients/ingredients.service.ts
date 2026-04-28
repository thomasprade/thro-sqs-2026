import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from '../recipes/recipe.entity';
import { CreateIngredientDto, UpdateIngredientDto } from './dto';
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

  private async findOne(id: number): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepo.findOneBy({ id });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient #${id} not found`);
    }
    return ingredient;
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

    return this.ingredientRepo.find({
      where: { recipeId },
      order: { id: 'ASC' },
    });
  }

  async updateIngredient(
    ingredientId: number,
    dto: UpdateIngredientDto,
  ): Promise<IngredientEntity> {
    const ingredient = await this.findOne(ingredientId);
    Object.assign(ingredient, dto);
    return this.ingredientRepo.save(ingredient);
  }

  async removeIngredient(ingredientId: number): Promise<void> {
    const ingredient = await this.findOne(ingredientId);
    await this.ingredientRepo.remove(ingredient);
  }
}
