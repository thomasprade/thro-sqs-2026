import {
  CreateRecipeDto as sharedCreateRecipeDto,
  UpdateRecipeDto as sharedUpdateRecipeDto,
} from '@app/shared';
import { IsNotEmpty, IsString } from 'class-validator';
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
