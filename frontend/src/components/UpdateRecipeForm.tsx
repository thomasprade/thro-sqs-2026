import { useState, type FormEvent } from 'react';
import type { Recipe, UpdateRecipeDto } from '@app/shared';

interface AddRecipeFormProps {
  recipe: Recipe;
  onUpdate: (id: number, dto: UpdateRecipeDto) => Promise<void>;
}

export default function UpdateRecipeForm({ recipe, onUpdate }: Readonly<AddRecipeFormProps>) {
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onUpdate(recipe.id, {
        title: trimmed,
        description: description.trim() || undefined,
        author: author.trim() || undefined,
      });
      setTitle(recipe.title);
      setDescription(recipe.description);
      setAuthor(recipe.author);
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
        placeholder={recipe.title}
        aria-label="Update recipe title"
        disabled={submitting}
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={recipe.description}
        aria-label="Update recipe description"
        disabled={submitting}
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
        aria-label="Update recipe author"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? 'Updating ...' : 'Update Recipe'}
      </button>
    </form>
  );
}
