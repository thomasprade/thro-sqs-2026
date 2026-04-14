import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/todo.entity';
import { TodoModule } from './todo/todo.module';
import { RecipeEntity } from './recipes/recipe.entity';
import { RecipeModule } from './recipes/recipe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || './data/database.sqlite',
      entities: [RecipeEntity],
      synchronize: true,
    }),
    RecipeModule,
  ],
})
export class AppModule {}
