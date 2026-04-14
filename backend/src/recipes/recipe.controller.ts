import { RecipeEntity } from './recipe.entity';
import { ApiResponse, Recipe } from '@app/shared';
import { RecipeService } from './recipe.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateRecipeDto, UpdateRecipeDto } from './dto';

function toRecipe(entity: RecipeEntity): Recipe {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    author: entity.author,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

@Controller('api/recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Recipe[]>> {
    const recipes = await this.recipeService.findAll();
    return { data: recipes.map(toRecipe) };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Recipe>> {
    const recipe = await this.recipeService.findOne(id);
    return { data: toRecipe(recipe) };
  }

  @Post()
  async create(@Body() dto: CreateRecipeDto): Promise<ApiResponse<Recipe>> {
    const recipe = await this.recipeService.create(dto);
    return { data: toRecipe(recipe) };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecipeDto,
  ): Promise<ApiResponse<Recipe>> {
    const recipe = await this.recipeService.update(id, dto);
    return { data: toRecipe(recipe) };
  }

  @Delete(':id')
  // HACK: Why do we use <{message: string}>, is that cannon?
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.recipeService.remove(id);
    return { message: `Todo #${id} deleted` };
  }
}
