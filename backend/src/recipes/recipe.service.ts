import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntry } from './recipe.entity';
import { Repository } from 'typeorm';
import { CreateRecipeDto, UpdateRecipeDto } from '@app/shared';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntry)
    private readonly recipeRepo: Repository<RecipeEntry>,
  ) {}

  async findAll(): Promise<RecipeEntry[]> {
    return this.recipeRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<RecipeEntry> {
    const recipe = await this.recipeRepo.findOneBy({ id });
    if (!recipe) {
      throw new NotFoundException(`Recipe #${id} not found`);
    }
    return recipe;
  }

  async create(dto: CreateRecipeDto): Promise<RecipeEntry> {
    const recipe = this.recipeRepo.create(dto);
    return this.recipeRepo.save(recipe);
  }

  // INFO: Still left to understand
  async update(id: number, dto: UpdateRecipeDto): Promise<RecipeEntry> {
    const recipe = await this.findOne(id);
    const changes = Object.fromEntries(Object.entries(dto).filter(([, v]) => v! !== undefined));
    Object.assign(recipe, changes);
    return this.recipeRepo.save(recipe);
  }

  async remove(id: number): Promise<void> {
    const recipe = await this.findOne(id);
    await this.recipeRepo.remove(recipe);
  }
}
