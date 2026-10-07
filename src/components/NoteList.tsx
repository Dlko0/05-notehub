import type { Note } from '../types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  loading?: boolean;
  onOpen: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export function NoteList({ notes, loading, onOpen, onDelete }: NoteListProps) {
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
            <time dateTime={note.createdAt}>
              {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(note.createdAt))}
            </time>
          </button>
          <button className={styles.delete} type="button" onClick={() => onDelete(note)} aria-label={`Delete ${note.title}`}>
            Delete
          </button>
        </article>
      ))}
    </div>
  );
}
