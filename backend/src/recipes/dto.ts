import { IsNotEmpty, IsString } from 'class-validator';
import {
  CreateRecipeDto as sharedCreateRecipeDto,
  UpdateRecipeDto as sharedUpdateRecipeDto,
} from '@app/shared';
//
export class CreateRecipeDto implements sharedCreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
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
