import type { Recipe, UpdateRecipeDto } from '@app/shared';
import { useState } from 'react';
import UpdateRecipeForm from './UpdateRecipeForm';

interface RecipeListProps {
  recipes: Recipe[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, dto: UpdateRecipeDto) => Promise<void>;
}

export default function RecipeList({ recipes, onUpdate, onDelete }: Readonly<RecipeListProps>) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (recipes.length === 0) {
    return <p data-testid="empty-state">No recipes yet. Add one above!</p>;
  }

  const handleUpdate = async (id: number, dto: UpdateRecipeDto) => {
    await onUpdate(id, dto);
    setEditingId(null);
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {recipes.map((recipe) => (
        <li
          key={recipe.id}
          data-testid={`recipe-${recipe.id}`}
          style={{
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ flex: 1, fontWeight: 'bold' }}>{recipe.title}</span>
            <button onClick={() => setEditingId((id) => (id === recipe.id ? null : recipe.id))}>
              {editingId === recipe.id ? 'Cancel' : 'Update'}
            </button>
            <button onClick={() => onDelete(recipe.id)} aria-label={`Delete ${recipe.title}`}>
              Delete
            </button>
          </div>
          {recipe.author && (
            <div style={{ color: '#666', fontSize: '0.875rem' }}>{recipe.author}</div>
          )}
          {recipe.description && <div style={{ marginTop: '0.25rem' }}>{recipe.description}</div>}
          {editingId === recipe.id && <UpdateRecipeForm recipe={recipe} onUpdate={handleUpdate} />}
        </li>
      ))}
    </ul>
  );
}
