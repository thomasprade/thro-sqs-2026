import type { Recipe } from '@app/shared';

interface RecipeListProps {
  recipes: Recipe[];
  onDelete: (id: number) => void;
}

export default function RecipeList({ recipes, onDelete }: Readonly<RecipeListProps>) {
  if (recipes.length === 0) {
    return <p data-testid="empty-state">No recipes yet. Add one above!</p>;
  }

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
            <button onClick={() => onDelete(recipe.id)} aria-label={`Delete ${recipe.title}`}>
              Delete
            </button>
          </div>
          {recipe.author && (
            <div style={{ color: '#666', fontSize: '0.875rem' }}>{recipe.author}</div>
          )}
          {recipe.description && <div style={{ marginTop: '0.25rem' }}>{recipe.description}</div>}
        </li>
      ))}
    </ul>
  );
}
