import {
  CreateIngredientDto as sharedCreateIngredientDto,
  CreateRecipeDto as sharedCreateRecipeDto,
  UpdateRecipeDto as sharedUpdateRecipeDto,
} from '@app/shared';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
//
export class CreateRecipeDto implements sharedCreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;
}

export class UpdateRecipeDto implements sharedUpdateRecipeDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  author!: string;
}

export class CreateIngredientDto implements sharedCreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;
}
