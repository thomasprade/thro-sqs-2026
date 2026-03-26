import { useState, type FormEvent } from 'react';

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo title"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        Add
      </button>
    </form>
  );
}
