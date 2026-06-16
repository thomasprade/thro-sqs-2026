import {
  CreateRecipeDto as sharedCreateRecipeDto,
  UpdateRecipeDto as sharedUpdateRecipeDto,
} from '@app/shared';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
//
export class CreateRecipeDto implements sharedCreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;
}

export class UpdateRecipeDto implements sharedUpdateRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;
}
