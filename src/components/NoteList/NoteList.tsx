import { toast } from 'react-hot-toast';
import { useDeleteNote } from '../../hooks/useNotes';
import type { Note } from '../../types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  loading?: boolean;
  onOpen: (note: Note) => void;
}

export function NoteList({ notes, loading, onOpen }: NoteListProps) {
  const deleteMutation = useDeleteNote();

  const handleDelete = async (note: Note) => {
    if (!window.confirm(`Delete “${note.title}”?`)) return;
    try {
      await deleteMutation.mutateAsync(note.id);
      toast.success('Note deleted');
    } catch {
      toast.error('Unable to delete note');
    }
  };

  if (loading) {
    return <div className={styles.empty}>Loading notes...</div>;
  }

  if (!notes.length) {
    return <div className={styles.empty}>No notes found. Create your first note.</div>;
  }

  return (
    <div className={styles.grid}>
      {notes.map((note) => (
        <article className={styles.card} key={note.id}>
          <button className={styles.open} type="button" onClick={() => onOpen(note)}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <span className={styles.tag}>{note.tag}</span>
            <time dateTime={note.createdAt}>
              {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(note.createdAt))}
            </time>
          </button>
          <button
            className={styles.delete}
            type="button"
            onClick={() => handleDelete(note)}
            disabled={deleteMutation.isPending}
            aria-label={`Delete ${note.title}`}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </article>
      ))}
    </div>
  );
}
