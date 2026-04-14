import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecipeEntity } from '../recipes/recipe.entity';

@Entity('recipe_ingredients')
export class IngredientEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  recipeId!: number;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe!: RecipeEntity;

  @Column()
  name!: string;

  @Column('float')
  amount!: number;

  @Column()
  unit!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
