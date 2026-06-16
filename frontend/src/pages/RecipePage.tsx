import type { CreateIngredientDto, Ingredient, Recipe, UpdateIngredientDto } from '@app/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  addIngredients,
  deleteIngredient,
  fetchIngredients,
  fetchRecipe,
  updateIngredient,
  updateRecipe,
} from '../api';
import { useAuth } from '../auth/AuthContext';
import IngredientFormDialog from '../components/IngredientFormDialog';
import IngredientList from '../components/IngredientList';
import IngredientToolbar from '../components/IngredientToolbar';
import UnsavedChangesDialog from '../components/UnsavedChangesDialog';
import Weather from '../components/Weather';

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [portions, setPortions] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>(undefined);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [showDescriptionUnsavedWarning, setShowDescriptionUnsavedWarning] = useState(false);

  const recipeId = Number(id);

  const isDescriptionDirty = descriptionDraft !== (recipe?.description ?? '');

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
        setDescriptionDraft(recipeData.description);
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

  const handleToggleEdit = () => {
    if (editing && isDescriptionDirty) {
      setShowDescriptionUnsavedWarning(true);
    } else {
      setEditing((prev) => !prev);
    }
  };

  const handleSaveDescription = async () => {
    const updated = await updateRecipe(recipeId, { description: descriptionDraft });
    setRecipe(updated);
  };

  const handleDiscardDescription = () => {
    setDescriptionDraft(recipe?.description ?? '');
    setShowDescriptionUnsavedWarning(false);
    setEditing(false);
  };

  const handleKeepEditing = () => {
    setShowDescriptionUnsavedWarning(false);
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Weather />
      </Box>
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

      <IngredientToolbar
        editing={editing}
        portions={portions}
        hasIngredients={ingredients.length > 0}
        onPortionsChange={setPortions}
        onToggleEdit={handleToggleEdit}
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

      <Box sx={{ mt: 4 }}>
        {editing && isLoggedIn ? (
          <>
            <TextField
              label="Description"
              value={descriptionDraft}
              onChange={(e) => setDescriptionDraft(e.target.value)}
              multiline
              minRows={4}
              fullWidth
              data-testid="description-field"
            />
            <Button
              variant="contained"
              onClick={handleSaveDescription}
              disabled={!isDescriptionDirty}
              sx={{ mt: 1 }}
              data-testid="save-description-button"
            >
              Save Description
            </Button>
          </>
        ) : (
          <Typography
            variant="body1"
            data-testid="description-text"
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {recipe.description}
          </Typography>
        )}
      </Box>

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

      <UnsavedChangesDialog
        open={showDescriptionUnsavedWarning}
        onDiscard={handleDiscardDescription}
        onKeepEditing={handleKeepEditing}
      />
    </Container>
  );
}
