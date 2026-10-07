import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNote, deleteNote, getNote, getNotes, updateNote } from '../services/noteService';
import type { Note, NotePayload } from '../types/note';

const NOTES_KEY = ['notes'] as const;

export function useNotes(page: number, perPage: number, search: string) {
  return useQuery({
    queryKey: [...NOTES_KEY, page, perPage, search],
    queryFn: () => getNotes(page, perPage, search),
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: [...NOTES_KEY, id],
    queryFn: () => getNote(id),
    enabled: Boolean(id),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: (note: Note) => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      return note;
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NotePayload }) => updateNote(id, payload),
    onSuccess: (_note: Note, variables) => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      queryClient.invalidateQueries({ queryKey: [...NOTES_KEY, variables.id] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: (_data, id: string) => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      queryClient.removeQueries({ queryKey: [...NOTES_KEY, id] });
    },
  });
}
