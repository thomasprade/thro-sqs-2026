import type { Recipe, CreateRecipeDto } from '@app/shared';
import { useCallback, useEffect, useState } from 'react';
import { createRecipe, deleteRecipe, fetchRecipes } from './api';
import AddRecipeForm from './components/AddRecipeForm';
import RecipeList from './components/RecipeList';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleAdd = async (dto: CreateRecipeDto) => {
    const recipe = await createRecipe(dto);
    setRecipes((prev) => [recipe, ...prev]);
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h1>Recipes</h1>
      <button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancel' : 'New Recipe'}</button>
      {showForm && <AddRecipeForm onAdd={handleAdd} />}
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <RecipeList recipes={recipes} onDelete={handleDelete} />}
    </div>
  );
}
