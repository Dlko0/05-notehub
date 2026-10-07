import type { Note } from './note';

export interface NotesPage {
  notes: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface NotesResponse {
  data?: Note[];
  items?: Note[];
  results?: Note[];
  total?: number;
  count?: number;
  page?: number;
  currentPage?: number;
  perPage?: number;
  limit?: number;
  totalPages?: number;
  pages?: number;
  [key: string]: unknown;
}
