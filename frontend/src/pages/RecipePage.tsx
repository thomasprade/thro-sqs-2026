import type { CreateIngredientDto, Ingredient, Recipe, UpdateIngredientDto } from '@app/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
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
      <Typography variant="body1" gutterBottom>
        {recipe.description}
      </Typography>

      {ingredients.length === 0 ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant={editing ? 'contained' : 'outlined'}
              onClick={() => setEditing((prev) => !prev)}
              data-testid="edit-ingredients-toggle"
            >
              {editing ? 'Done' : 'Edit Ingredients'}
            </Button>
            {editing && (
              <Button
                variant="outlined"
                onClick={() => setAddDialogOpen(true)}
                sx={{ ml: 1 }}
                data-testid="add-ingredients-button"
              >
                Add Ingredients
              </Button>
            )}
          </Box>
          <Typography data-testid="no-ingredients">No ingredients yet</Typography>
        </>
      ) : (
        <>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}
          >
            {!editing ? (
              <TextField
                label="Portions"
                type="number"
                value={portions}
                onChange={(e) => {
                  const val = Math.max(0.5, Number(e.target.value));
                  setPortions(val);
                }}
                slotProps={{ htmlInput: { step: 0.5, min: 0.5 } }}
                size="small"
                data-testid="portions-input"
              />
            ) : (
              <Box />
            )}
            <Box>
              <Button
                variant={editing ? 'contained' : 'outlined'}
                onClick={() => setEditing((prev) => !prev)}
                data-testid="edit-ingredients-toggle"
              >
                {editing ? 'Done' : 'Edit Ingredients'}
              </Button>
              {editing && (
                <Button
                  variant="outlined"
                  onClick={() => setAddDialogOpen(true)}
                  sx={{ ml: 1 }}
                  data-testid="add-ingredients-button"
                >
                  Add Ingredients
                </Button>
              )}
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ingredient</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Unit</TableCell>
                  {editing && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id} data-testid={`ingredient-${ingredient.id}`}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell align="right">
                      {editing
                        ? ingredient.amount
                        : Math.round(ingredient.amount * portions * 100) / 100}
                    </TableCell>
                    <TableCell>{ingredient.unit}</TableCell>
                    {editing && (
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          aria-label={`Edit ${ingredient.name}`}
                          onClick={() => setEditingIngredient(ingredient)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label={`Delete ${ingredient.name}`}
                          onClick={() => handleDeleteIngredient(ingredient.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
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
