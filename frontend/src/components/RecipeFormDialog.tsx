import type { CreateRecipeDto, Recipe, UpdateRecipeDto } from '@app/shared';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import UnsavedChangesDialog from './UnsavedChangesDialog';

type RecipeFormDialogProps = {
  open: boolean;
  onClose: () => void;
} & (
  | { recipe: undefined; onSave: (dto: CreateRecipeDto) => Promise<void> }
  | { recipe: Recipe; onSave: (dto: UpdateRecipeDto) => Promise<void> }
);

export default function RecipeFormDialog({
  open,
  recipe,
  onSave,
  onClose,
}: Readonly<RecipeFormDialogProps>) {
  const isEdit = !!recipe;
  const initialTitle = recipe?.title ?? '';
  const initialDescription = recipe?.description ?? '';
  const initialAuthor = recipe?.author ?? '';

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [author, setAuthor] = useState(initialAuthor);
  const [submitting, setSubmitting] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(recipe?.title ?? '');
      setDescription(recipe?.description ?? '');
      setAuthor(recipe?.author ?? '');
    }
    setSubmitting(false);
    setShowUnsavedWarning(false);
  }, [open, recipe?.id]);

  const isDirty =
    title !== initialTitle || description !== initialDescription || author !== initialAuthor;

  const handleClose = () => {
    if (isDirty) {
      setShowUnsavedWarning(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setShowUnsavedWarning(false);
    onClose();
  };

  const handleKeepEditing = () => {
    setShowUnsavedWarning(false);
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    setSubmitting(true);
    try {
      await onSave({
        title: trimmedTitle,
        description: description.trim(),
        author: author.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="recipe-form-dialog-title"
      >
        <DialogTitle id="recipe-form-dialog-title">
          {isEdit ? 'Edit Recipe' : 'Add Recipe'}
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            required
            fullWidth
          />
          <TextField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={submitting}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={submitting || !title.trim()}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <UnsavedChangesDialog
        open={showUnsavedWarning}
        onDiscard={handleDiscard}
        onKeepEditing={handleKeepEditing}
      />
    </>
  );
}
