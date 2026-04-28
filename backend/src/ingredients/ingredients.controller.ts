import { ApiResponse, Ingredient } from '@app/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateIngredientDto, UpdateIngredientDto } from './dto';
import { toIngredient } from './ingredients.mapper';
import { IngredientsService } from './ingredients.service';

@Controller('api/recipes/:recipeId/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  async getIngredients(
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<ApiResponse<Ingredient[]>> {
    const ingredients = await this.ingredientsService.getIngredients(recipeId);
    return { data: ingredients.map(toIngredient) };
  }

  @Post()
  async addIngredients(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body(
      new ParseArrayPipe({
        items: CreateIngredientDto,
        whitelist: true,
      }),
    )
    dtos: CreateIngredientDto[],
  ): Promise<ApiResponse<Ingredient[]>> {
    const ingredients = await this.ingredientsService.addIngredients(recipeId, dtos);
    return { data: ingredients.map(toIngredient) };
  }

  @Put(':ingredientId')
  async updateIngredient(
    @Param('ingredientId', ParseIntPipe) ingredientId: number,
    @Body() dto: UpdateIngredientDto,
  ): Promise<ApiResponse<Ingredient>> {
    const ingredient = await this.ingredientsService.updateIngredient(ingredientId, dto);
    return { data: toIngredient(ingredient) };
  }

  @Delete(':ingredientId')
  async deleteIngredient(
    @Param('ingredientId', ParseIntPipe) ingredientId: number,
  ): Promise<{ message: string }> {
    await this.ingredientsService.removeIngredient(ingredientId);
    return { message: `Ingredient #${ingredientId} deleted` };
  }
}
