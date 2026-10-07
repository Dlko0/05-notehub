import { api } from '../lib/axios';
import { normalizeNote, normalizeNotesPage } from '../lib/normalize';
import type { Note, NotePayload, NotesPage, NotesResponse } from '../types/note';

export async function getNotes(page: number, perPage: number, search = ''): Promise<NotesPage> {
  const response = await api.get<NotesResponse>('/notes', {
    params: { page, perPage, search: search.trim() || undefined },
  });
  return normalizeNotesPage(response.data, page, perPage);
}

export async function getNote(id: string | number): Promise<Note> {
  const response = await api.get<unknown>(`/notes/${id}`);
  return normalizeNote(response.data);
}

export async function createNote(payload: NotePayload): Promise<Note> {
  const response = await api.post<unknown>('/notes', payload);
  return normalizeNote(response.data);
}

export async function updateNote(id: string | number, payload: NotePayload): Promise<Note> {
  const response = await api.put<unknown>(`/notes/${id}`, payload);
  return normalizeNote(response.data);
}

export async function deleteNote(id: string | number): Promise<void> {
  await api.delete(`/notes/${id}`);
}
