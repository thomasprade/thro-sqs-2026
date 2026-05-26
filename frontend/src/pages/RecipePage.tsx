import type { Ingredient, Recipe } from '@app/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  Container,
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
import { fetchIngredients, fetchRecipe } from '../api';

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [portions, setPortions] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const recipeId = Number(id);

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
        <Typography data-testid="no-ingredients">No ingredients yet</Typography>
      ) : (
        <>
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
            sx={{ my: 2 }}
            data-testid="portions-input"
          />

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ingredient</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id} data-testid={`ingredient-${ingredient.id}`}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell align="right">
                      {Math.round(ingredient.amount * portions * 100) / 100}
                    </TableCell>
                    <TableCell>{ingredient.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}
