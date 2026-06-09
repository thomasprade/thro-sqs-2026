import { Box, Button, TextField } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

interface IngredientToolbarProps {
  editing: boolean;
  portions: number;
  hasIngredients: boolean;
  onPortionsChange: (value: number) => void;
  onToggleEdit: () => void;
  onAddClick: () => void;
}

export default function IngredientToolbar({
  editing,
  portions,
  hasIngredients,
  onPortionsChange,
  onToggleEdit,
  onAddClick,
}: Readonly<IngredientToolbarProps>) {
  const { isLoggedIn } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: hasIngredients && !editing ? 'space-between' : 'flex-end',
        alignItems: 'center',
        my: 2,
      }}
    >
      {hasIngredients && !editing && (
        <TextField
          label="Portions"
          type="number"
          value={portions}
          onChange={(e) => {
            const raw = e.target.value;
            if (!raw) return;
            const parsed = Number(raw);
            if (Number.isFinite(parsed)) {
              onPortionsChange(Math.max(0.5, parsed));
            }
          }}
          slotProps={{ htmlInput: { step: 0.5, min: 0.5 } }}
          size="small"
          data-testid="portions-input"
        />
      )}
      {isLoggedIn && (
        <Box>
          <Button
            variant={editing ? 'contained' : 'outlined'}
            onClick={onToggleEdit}
            data-testid="edit-ingredients-toggle"
          >
            {editing ? 'Done' : 'Edit Ingredients'}
          </Button>
          {editing && (
            <Button
              variant="outlined"
              onClick={onAddClick}
              sx={{ ml: 1 }}
              data-testid="add-ingredients-button"
            >
              Add Ingredients
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
