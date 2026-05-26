import type { CreateIngredientDto, Ingredient, UpdateIngredientDto } from '@app/shared';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface IngredientRow {
  name: string;
  amount: string;
  unit: string;
}

const emptyRow = (): IngredientRow => ({ name: '', amount: '', unit: '' });

type IngredientFormDialogProps = {
  open: boolean;
  onClose: () => void;
} & (
  | { ingredient: undefined; onSave: (dtos: CreateIngredientDto[]) => Promise<void> }
  | { ingredient: Ingredient; onSave: (dto: UpdateIngredientDto) => Promise<void> }
);

export default function IngredientFormDialog({
  open,
  ingredient,
  onSave,
  onClose,
}: Readonly<IngredientFormDialogProps>) {
  const isEdit = !!ingredient;
  const [rows, setRows] = useState<IngredientRow[]>([emptyRow()]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (ingredient) {
        setRows([
          { name: ingredient.name, amount: String(ingredient.amount), unit: ingredient.unit },
        ]);
      } else {
        setRows([emptyRow()]);
      }
    }
    setSubmitting(false);
  }, [open, ingredient?.id]);

  const updateRow = (index: number, field: keyof IngredientRow, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid = rows.every((row) => row.name.trim() && row.amount.trim() && row.unit.trim());

  const handleSave = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        const row = rows[0];
        await (onSave as (dto: UpdateIngredientDto) => Promise<void>)({
          name: row.name.trim(),
          amount: Number(row.amount),
          unit: row.unit.trim(),
        });
      } else {
        const dtos: CreateIngredientDto[] = rows.map((row) => ({
          name: row.name.trim(),
          amount: Number(row.amount),
          unit: row.unit.trim(),
        }));
        await (onSave as (dtos: CreateIngredientDto[]) => Promise<void>)(dtos);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Ingredient' : 'Add Ingredients'}</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}
      >
        {rows.map((row, index) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center">
            <TextField
              label="Name"
              value={row.name}
              onChange={(e) => updateRow(index, 'name', e.target.value)}
              disabled={submitting}
              required
              size="small"
              data-testid={`ingredient-name-${index}`}
            />
            <TextField
              label="Amount"
              type="number"
              value={row.amount}
              onChange={(e) => updateRow(index, 'amount', e.target.value)}
              disabled={submitting}
              required
              size="small"
              sx={{ width: 100 }}
              data-testid={`ingredient-amount-${index}`}
            />
            <TextField
              label="Unit"
              value={row.unit}
              onChange={(e) => updateRow(index, 'unit', e.target.value)}
              disabled={submitting}
              required
              size="small"
              sx={{ width: 100 }}
              data-testid={`ingredient-unit-${index}`}
            />
            {!isEdit && rows.length > 1 && (
              <IconButton
                size="small"
                onClick={() => removeRow(index)}
                aria-label={`Remove row ${index + 1}`}
                disabled={submitting}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ))}
        {!isEdit && (
          <Button
            startIcon={<AddIcon />}
            onClick={addRow}
            disabled={submitting}
            size="small"
            data-testid="add-another-row"
          >
            Add another
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!isValid || submitting}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
