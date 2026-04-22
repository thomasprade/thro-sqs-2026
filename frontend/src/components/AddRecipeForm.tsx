import { useState, type FormEvent } from 'react';
import type { CreateRecipeDto } from '@app/shared';

interface AddRecipeFormProps {
  onAdd: (dto: CreateRecipeDto) => Promise<void>;
}

export default function AddRecipeForm({ onAdd }: Readonly<AddRecipeFormProps>) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onAdd({
        title: trimmed,
        description: description.trim() || undefined,
        author: author.trim() || undefined,
      });
      setTitle('');
      setDescription('');
      setAuthor('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Recipe title"
        disabled={submitting}
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Recipe description"
        disabled={submitting}
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author (optional)"
        aria-label="Recipe author"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? 'Adding...' : 'Add Recipe'}
      </button>
    </form>
  );
}
