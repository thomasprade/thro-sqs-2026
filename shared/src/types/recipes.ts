export interface Recipe {
  id: number;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeDto {
  title: string;
  description: string;
  author: string;
}

export interface UpdateRecipeDto {
  title?: string;
  description?: string;
  author?: string;
}
