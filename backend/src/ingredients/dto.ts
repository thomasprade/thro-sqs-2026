import {
  CreateIngredientDto as sharedCreateIngredientDto,
  UpdateIngredientDto as sharedUpdateIngredientDto,
} from '@app/shared';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

export class UpdateIngredientDto implements sharedUpdateIngredientDto {
  @IsString()
  name?: string;

  @IsNumber()
  amount?: number;

  @IsString()
  unit?: string;
}
