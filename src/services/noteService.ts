import { api } from '../lib/axios';
import { normalizeNote, normalizeNotesPage } from '../lib/normalize';
import type { Note, NotePayload } from '../types/note';
import type { NotesPage, NotesResponse } from '../types/notesPage';

export async function getNotes(page: number, perPage: number, search = ''): Promise<NotesPage> {
  const response = await api.get<NotesResponse>('/notes', {
    params: { page, perPage, search: search.trim() || undefined },
  });
  return normalizeNotesPage(response.data, page, perPage);
}

export async function getNote(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return normalizeNote(response.data);
}

export async function createNote(payload: NotePayload): Promise<Note> {
  const response = await api.post<Note>('/notes', payload);
  return normalizeNote(response.data);
}

export async function updateNote(id: string, payload: NotePayload): Promise<Note> {
  const response = await api.put<Note>(`/notes/${id}`, payload);
  return normalizeNote(response.data);
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return normalizeNote(response.data);
}
