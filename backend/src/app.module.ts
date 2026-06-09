import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/user.entity';
import { IngredientEntity } from './ingredients/ingredient.entity';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipeEntity } from './recipes/recipe.entity';
import { RecipeModule } from './recipes/recipe.module';

const databasePath = process.env.DATABASE_PATH || './data/database.sqlite';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: databasePath,
      entities: [RecipeEntity, IngredientEntity, UserEntity],
      synchronize: true,
    }),
    AuthModule,
    RecipeModule,
    IngredientsModule,
  ],
})
export class AppModule {}
