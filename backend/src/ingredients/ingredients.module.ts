import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from '../recipes/recipe.entity';
import { IngredientEntity } from './ingredient.entity';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity, RecipeEntity])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
