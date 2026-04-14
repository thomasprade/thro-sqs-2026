import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredientDto, CreateRecipeDto, UpdateRecipeDto } from './dto';
import { IngredientEntity } from './ingredient.entity';
import { RecipeEntity } from './recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepo: Repository<RecipeEntity>,
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepo: Repository<IngredientEntity>,
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    return this.recipeRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<RecipeEntity> {
    const recipe = await this.recipeRepo.findOneBy({ id });
    if (!recipe) {
      throw new NotFoundException(`Recipe #${id} not found`);
    }
    return recipe;
  }

  async create(dto: CreateRecipeDto): Promise<RecipeEntity> {
    const recipe = this.recipeRepo.create(dto);
    return this.recipeRepo.save(recipe);
  }

  // INFO: Still left to understand
  async update(id: number, dto: UpdateRecipeDto): Promise<RecipeEntity> {
    const recipe = await this.findOne(id);
    const changes = Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined));
    Object.assign(recipe, changes);
    return this.recipeRepo.save(recipe);
  }

  async remove(id: number): Promise<void> {
    const recipe = await this.findOne(id);
    await this.recipeRepo.remove(recipe);
  }

  async getIngredients(recipeId: number): Promise<IngredientEntity[]> {
    await this.findOne(recipeId);
    return this.ingredientRepo.find({
      where: { recipeId },
      order: { id: 'ASC' },
    });
  }

  async addIngredients(recipeId: number, dtos: CreateIngredientDto[]): Promise<IngredientEntity[]> {
    await this.findOne(recipeId);

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
