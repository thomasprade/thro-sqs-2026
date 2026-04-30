import { ApiResponse, Ingredient } from '@app/shared';
import { Body, Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Post } from '@nestjs/common';
import { CreateIngredientDto } from './ingredient.dto';
import { toIngredient } from './ingredients.mapper';
import { IngredientsService } from './ingredients.service';

@Controller('api/recipes/:id/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  async getIngredients(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Ingredient[]>> {
    const ingredients = await this.ingredientsService.getIngredients(id);
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
    const ingredients = await this.ingredientsService.addIngredients(id, dtos);
    return { data: ingredients.map(toIngredient) };
  }
}
