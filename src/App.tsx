import { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from './hooks/useNotes';
import type { Note, NotePayload } from './types/note';
import { Modal } from './components/Modal';
import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import { Pagination } from './components/Pagination';
import './App.module.css';

const PER_PAGE = 9;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const deleteMutation = useDeleteNote();
  const notesQuery = useNotes(page, PER_PAGE, debouncedSearch);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  const openCreate = () => {
    setSelectedNote(undefined);
    setModal('create');
  };

  const openEdit = (note: Note) => {
    setSelectedNote(note);
    setModal('edit');
  };

  const closeModal = useCallback(() => {
    setModal(null);
    setSelectedNote(undefined);
  }, []);

  const handleSubmit = async (payload: NotePayload) => {
    if (modal === 'edit' && selectedNote) {
      await updateMutation.mutateAsync({ id: selectedNote.id, payload });
      toast.success('Note updated');
    } else {
      await createMutation.mutateAsync(payload);
      toast.success('Note created');
    }
    closeModal();
  };

  const handleDelete = async (note: Note) => {
    if (!window.confirm(`Delete “${note.title}”?`)) return;
    try {
      await deleteMutation.mutateAsync(note.id);
      toast.success('Note deleted');
    } catch {
      toast.error('Unable to delete note');
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Personal workspace</p>
          <h1>NoteHub</h1>
        </div>
        <button className="button button-primary" type="button" onClick={openCreate}>+ New note</button>
      </header>

      <main>
        <section className="toolbar">
          <label className="search">
            <span className="sr-only">Search notes</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes..."
            />
          </label>
          <span className="count">{notesQuery.data?.total ?? 0} notes</span>
        </section>

        {notesQuery.isError && <div className="error">Unable to load notes. Please try again.</div>}
        <NoteList
          notes={notesQuery.data?.notes ?? []}
          loading={notesQuery.isPending}
          onOpen={openEdit}
          onDelete={handleDelete}
        />
        <Pagination page={notesQuery.data?.page ?? page} totalPages={notesQuery.data?.totalPages ?? 1} onPageChange={setPage} />
      </main>

      <Modal open={modal !== null} title={modal === 'edit' ? 'Edit note' : 'Create note'} onClose={closeModal}>
        <NoteForm
          note={selectedNote}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={closeModal}
        />
      </Modal>
      <Toaster position="top-right" />
    </div>
  );
}
