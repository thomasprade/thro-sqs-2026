import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/todo.entity';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || './data/database.sqlite',
      entities: [TodoEntity],
      synchronize: true,
    }),
    TodoModule,
  ],
})
export class AppModule {}
