import type { Recipe, UpdateRecipeDto } from '@app/shared';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import UpdateRecipeForm from './UpdateRecipeForm';

interface RecipeListProps {
  recipes: Recipe[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, dto: UpdateRecipeDto) => Promise<void>;
}

export default function RecipeList({ recipes, onUpdate, onDelete }: Readonly<RecipeListProps>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (recipes.length === 0) {
    return <p data-testid="empty-state">No recipes yet. Add one above!</p>;
  }

  const handleUpdate = async (id: number, dto: UpdateRecipeDto) => {
    await onUpdate(id, dto);
    setEditingId(null);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const query = debouncedQuery.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        data-testid="recipe-search"
      />
      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '25%' }}>Recipe Name</TableCell>
              <TableCell sx={{ width: '45%' }}>Recipe Description</TableCell>
              <TableCell sx={{ width: '15%'}}>Author</TableCell>
              <TableCell sx={{ width: '15%' }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No matching recipes
                </TableCell>
              </TableRow>
            ) : (
              filteredRecipes.map((recipe) => (
                <Fragment key={recipe.id}>
                  <TableRow
                    data-testid={`recipe-${recipe.id}`}
                    hover
                    onClick={() => navigate('/demo')}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{recipe.title}</TableCell>
                    <TableCell>{recipe.description}</TableCell>
                    <TableCell>{recipe.author}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label={`Edit ${recipe.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId((id) => (id === recipe.id ? null : recipe.id));
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={`Delete ${recipe.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(recipe.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {editingId === recipe.id && (
                    <TableRow key={`edit-${recipe.id}`}>
                      <TableCell colSpan={3} onClick={(e) => e.stopPropagation()}>
                        <UpdateRecipeForm recipe={recipe} onUpdate={handleUpdate} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
