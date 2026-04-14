import { ApiResponse, Ingredient } from '@app/shared';
import { Body, Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Post } from '@nestjs/common';
import { CreateIngredientDto } from './dto';
import { RecipeService } from './recipe.service';
import { toIngredient } from './recipes.mapper';

@Controller('api/recipes/:id/ingredients')
export class IngredientsController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getIngredients(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Ingredient[]>> {
    const ingredients = await this.recipeService.getIngredients(id);
    return { data: ingredients.map(toIngredient) };
  }

  @Post()
  async addIngredients(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new ParseArrayPipe({
        items: CreateIngredientDto,
        whitelist: true,
      }),
    )
    dtos: CreateIngredientDto[],
  ): Promise<ApiResponse<Ingredient[]>> {
    const ingredients = await this.recipeService.addIngredients(id, dtos);
    return { data: ingredients.map(toIngredient) };
  }
}
