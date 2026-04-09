import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntry } from './recipe.entity';
import { RecpipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntry])],
  controllers: [RecpipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
