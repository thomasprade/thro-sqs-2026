import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface UnsavedChangesDialogProps {
  open: boolean;
  onDiscard: () => void;
  onKeepEditing: () => void;
}

export default function UnsavedChangesDialog({
  open,
  onDiscard,
  onKeepEditing,
}: Readonly<UnsavedChangesDialogProps>) {
  return (
    <Dialog open={open} onClose={onKeepEditing}>
      <DialogTitle>Unsaved Changes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes. Do you want to discard them?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onKeepEditing}>Keep Editing</Button>
        <Button onClick={onDiscard} color="error">
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}
