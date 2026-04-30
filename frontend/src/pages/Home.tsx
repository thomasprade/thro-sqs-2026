import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '@app/shared';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { createRecipe, deleteRecipe, fetchRecipes, updateRecipe } from '../api';
import RecipeFormDialog from '../components/RecipeFormDialog';
import RecipeList from '../components/RecipeList';

interface DialogState {
  open: boolean;
  recipe?: Recipe;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({ open: false });

  const loadRecipes = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchRecipes();
      setRecipes(data);
    } catch {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleSave = async (dto: CreateRecipeDto | UpdateRecipeDto) => {
    if (dialogState.recipe) {
      const updated = await updateRecipe(dialogState.recipe.id, dto);
      setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      const created = await createRecipe(dto as CreateRecipeDto);
      setRecipes((prev) => [created, ...prev]);
    }
    setDialogState({ open: false });
  };

  const handleDelete = async (id: number) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (recipe: Recipe) => {
    setDialogState({ open: true, recipe });
  };

  return (
    <div>
      <h1>Recipes</h1>
      <Button variant="contained" onClick={() => setDialogState({ open: true })}>
        New Recipe
      </Button>
      <RecipeFormDialog
        open={dialogState.open}
        recipe={dialogState.recipe}
        onSave={handleSave}
        onClose={() => setDialogState({ open: false })}
      />
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <RecipeList recipes={recipes} onDelete={handleDelete} onEdit={handleEdit} />
      )}
    </div>
  );
}
