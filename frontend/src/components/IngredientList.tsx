import type { Ingredient } from '@app/shared';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface IngredientListProps {
  ingredients: Ingredient[];
  editing: boolean;
  portions: number;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredientId: number) => void;
}

export default function IngredientList({
  ingredients,
  editing,
  portions,
  onEdit,
  onDelete,
}: Readonly<IngredientListProps>) {
  return (
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
                {editing ? ingredient.amount : Math.round(ingredient.amount * portions * 100) / 100}
              </TableCell>
              <TableCell>{ingredient.unit}</TableCell>
              {editing && (
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label={`Edit ${ingredient.name}`}
                    onClick={() => onEdit(ingredient)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={`Delete ${ingredient.name}`}
                    onClick={() => onDelete(ingredient.id)}
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
  );
}
