import { CreateIngredientDto as sharedCreateIngredientDto } from '@app/shared';
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
