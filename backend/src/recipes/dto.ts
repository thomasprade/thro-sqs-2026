import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRecipe {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  author!: string;
}

export class UpdateRecipe {
  // MAYBE: id needed?
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  author!: string;
}
