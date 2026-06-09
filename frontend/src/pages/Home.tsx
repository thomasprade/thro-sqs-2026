import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '@app/shared';
import { Box, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { createRecipe, deleteRecipe, fetchRecipes, updateRecipe } from '../api';
import { useAuth } from '../auth/AuthContext';
import LoginDialog from '../components/LoginDialog';
import RecipeFormDialog from '../components/RecipeFormDialog';
import RecipeList from '../components/RecipeList';

interface DialogState {
  open: boolean;
  recipe?: Recipe;
}

export default function Home() {
  const { isLoggedIn, logout } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({ open: false });
  const [loginOpen, setLoginOpen] = useState(false);

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

  const handleCreate = async (dto: CreateRecipeDto) => {
    const created = await createRecipe(dto);
    setRecipes((prev) => [created, ...prev]);
    setDialogState({ open: false });
  };

  const handleUpdate = async (dto: UpdateRecipeDto) => {
    const updated = await updateRecipe(dialogState.recipe!.id, dto);
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <h1 style={{ margin: 0 }}>Recipes</h1>
        {isLoggedIn ? (
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => setLoginOpen(true)}>
            Login
          </Button>
        )}
      </Box>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
      {isLoggedIn && (
        <Button
          variant="contained"
          onClick={() => setDialogState({ open: true })}
          sx={{ display: 'block', ml: 'auto', mb: 2 }}
        >
          New Recipe
        </Button>
      )}
      {dialogState.recipe ? (
        <RecipeFormDialog
          open={dialogState.open}
          recipe={dialogState.recipe}
          onSave={handleUpdate}
          onClose={() => setDialogState({ open: false })}
        />
      ) : (
        <RecipeFormDialog
          open={dialogState.open}
          recipe={undefined}
          onSave={handleCreate}
          onClose={() => setDialogState({ open: false })}
        />
      )}
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <RecipeList recipes={recipes} onDelete={handleDelete} onEdit={handleEdit} />
      )}
    </div>
  );
}
