import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientEntity } from './recipes/ingredient.entity';
import { RecipeEntity } from './recipes/recipe.entity';
import { RecipeModule } from './recipes/recipe.module';

const databasePath =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.DATABASE_PATH ?? './data/database.sqlite';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: databasePath,
      entities: [RecipeEntity, IngredientEntity],
      synchronize: true,
    }),
    RecipeModule,
  ],
})
export class AppModule {}
