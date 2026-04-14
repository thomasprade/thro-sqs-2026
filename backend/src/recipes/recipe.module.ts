import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientEntity } from './ingredient.entity';
import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, IngredientEntity])],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
