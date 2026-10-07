import type { Note, NotesPage, NotesResponse } from '../types/note';

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function normalizeNotesPage(response: NotesResponse, page: number, perPage: number): NotesPage {
  const notes = (response.data ?? response.items ?? response.results ?? []) as Note[];
  const total = toNumber(response.total ?? response.count, notes.length);
  const totalPages = toNumber(response.totalPages ?? response.pages, 1);

  return {
    notes,
    total,
    page: toNumber(response.page ?? response.currentPage, page),
    perPage: toNumber(response.perPage ?? response.limit, perPage),
    totalPages: totalPages || Math.ceil(total / perPage),
  };
}

export function normalizeNote(value: unknown): Note {
  if (!value || typeof value !== 'object') throw new Error('Invalid note response');
  const note = value as Record<string, unknown>;
  const id = note.id ?? note.noteId;
  const title = note.title ?? note.name;
  const content = note.content ?? note.body;
  const createdAt = note.createdAt ?? note.created_at ?? note.created;
  const updatedAt = note.updatedAt ?? note.updated_at ?? note.updated;

  if (id === undefined || id === null || typeof title !== 'string' || typeof content !== 'string' || createdAt === undefined) {
    throw new Error('Invalid note response');
  }

  const normalizedId = typeof id === 'number' ? id : String(id);
  return { id: normalizedId, title, content, createdAt: String(createdAt), updatedAt: updatedAt ? String(updatedAt) : undefined };
}
