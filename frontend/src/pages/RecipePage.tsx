import type { CreateIngredientDto, Ingredient, Recipe, UpdateIngredientDto } from '@app/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  addIngredients,
  deleteIngredient,
  fetchIngredients,
  fetchRecipe,
  updateIngredient,
} from '../api';
import IngredientFormDialog from '../components/IngredientFormDialog';
import IngredientList from '../components/IngredientList';
import IngredientToolbar from '../components/IngredientToolbar';

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [portions, setPortions] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>(undefined);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const recipeId = Number(id);

  useEffect(() => {
    if (!id) return;

    if (!Number.isFinite(recipeId)) {
      setError('Invalid recipe ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([fetchRecipe(recipeId), fetchIngredients(recipeId)])
      .then(([recipeData, ingredientsData]) => {
        setRecipe(recipeData);
        setIngredients(ingredientsData);
      })
      .catch(() => setError('Failed to load recipe'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteIngredient = async (ingredientId: number) => {
    await deleteIngredient(recipeId, ingredientId);
    setIngredients((prev) => prev.filter((i) => i.id !== ingredientId));
  };

  const handleUpdateIngredient = async (dto: UpdateIngredientDto) => {
    if (!editingIngredient) return;
    const updated = await updateIngredient(recipeId, editingIngredient.id, dto);
    setIngredients((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setEditingIngredient(undefined);
  };

  const handleAddIngredients = async (dtos: CreateIngredientDto[]) => {
    const updatedList = await addIngredients(recipeId, dtos);
    setIngredients(updatedList);
    setAddDialogOpen(false);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography data-testid="loading">Loading...</Typography>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error" data-testid="error">
          {error ?? 'Recipe not found'}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to recipes
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
        data-testid="back-button"
      >
        Back to recipes
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        {recipe.title}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        By {recipe.author}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {recipe.description}
      </Typography>

      <IngredientToolbar
        editing={editing}
        portions={portions}
        hasIngredients={ingredients.length > 0}
        onPortionsChange={setPortions}
        onToggleEdit={() => setEditing((prev) => !prev)}
        onAddClick={() => setAddDialogOpen(true)}
      />

      {ingredients.length === 0 ? (
        <Typography data-testid="no-ingredients">No ingredients yet</Typography>
      ) : (
        <IngredientList
          ingredients={ingredients}
          editing={editing}
          portions={portions}
          onEdit={setEditingIngredient}
          onDelete={handleDeleteIngredient}
        />
      )}

      <IngredientFormDialog
        open={addDialogOpen}
        ingredient={undefined}
        onSave={handleAddIngredients}
        onClose={() => setAddDialogOpen(false)}
      />

      {editingIngredient && (
        <IngredientFormDialog
          open={true}
          ingredient={editingIngredient}
          onSave={handleUpdateIngredient}
          onClose={() => setEditingIngredient(undefined)}
        />
      )}
    </Container>
  );
}
