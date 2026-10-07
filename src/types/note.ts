export interface Note {
  id: string | number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotePayload {
  title: string;
  content: string;
}

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
