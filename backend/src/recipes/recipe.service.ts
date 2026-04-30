import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';
import { RecipeEntity } from './recipe.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepo: Repository<RecipeEntity>,
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
}
