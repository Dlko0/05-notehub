import { useCallback, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import { useNotes } from '../../hooks/useNotes';
import type { Note } from '../../types/note';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';
import { NoteList } from '../NoteList/NoteList';
import { Pagination } from '../Pagination/Pagination';
import { SearchBox } from '../SearchBox/SearchBox';
import './App.module.css';

const PER_PAGE = 9;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
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
          <SearchBox value={search} onChange={setSearch} />
          <span className="count">{notesQuery.data?.total ?? 0} notes</span>
        </section>

        {notesQuery.isError && <div className="error">Unable to load notes. Please try again.</div>}
        {notesQuery.data?.notes.length ? (
          <NoteList notes={notesQuery.data.notes} loading={notesQuery.isPending} onOpen={openEdit} />
        ) : null}
        {notesQuery.data && notesQuery.data.totalPages > 1 ? (
          <Pagination page={notesQuery.data.page} totalPages={notesQuery.data.totalPages} onPageChange={setPage} />
        ) : null}
      </main>

      <Modal open={modal !== null} title={modal === 'edit' ? 'Edit note' : 'Create note'} onClose={closeModal}>
        <NoteForm note={selectedNote} onCancel={closeModal} />
      </Modal>
      <Toaster position="top-right" />
    </div>
  );
}
