import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, type FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { createNote, updateNote } from '../../services/noteService';
import type { Note, NotePayload } from '../../types/note';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

interface NoteFormProps {
  note?: Note;
  onCancel: () => void;
}

interface FormikValues {
  title: string;
  content: string;
  tag: string;
}

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const;

const schema = Yup.object({
  title: Yup.string().trim().min(3, 'Title must be at least 3 characters').max(50, 'Title must be at most 50 characters'),
  content: Yup.string().trim().max(500, 'Content must be at most 500 characters'),
  tag: Yup.string().oneOf(tags, 'Select a valid tag').required('Tag is required'),
});

export function NoteForm({ note, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: NotePayload) => (note ? updateNote(note.id, payload) : createNote(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <Formik
      initialValues={{ title: note?.title ?? '', content: note?.content ?? '', tag: note?.tag ?? '' }}
      validationSchema={schema}
      onSubmit={async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
        try {
          const payload: NotePayload = { title: values.title.trim(), content: values.content.trim() || undefined, tag: values.tag };
          await mutation.mutateAsync(payload);
          toast.success(note ? 'Note updated' : 'Note created');
          onCancel();
        } catch (error) {
          helpers.setStatus({ error: error instanceof Error ? error.message : 'Unable to save note' });
        }
      }}
    >
      {({ values, errors, touched, isSubmitting: submitting, handleChange, handleBlur, handleSubmit }) => (
        <form className="note-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Title</span>
            <input
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Note title"
              aria-invalid={Boolean(touched.title && errors.title)}
            />
            {touched.title && errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </label>
          <label>
            <span>Content</span>
            <textarea
              name="content"
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Write your note..."
              rows={8}
              aria-invalid={Boolean(touched.content && errors.content)}
            />
            {touched.content && errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
          </label>
          <label>
            <span>Tag</span>
            <select name="tag" value={values.tag} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.tag && errors.tag)}>
              <option value="">Select a tag</option>
              {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            {touched.tag && errors.tag && <ErrorMessage>{errors.tag}</ErrorMessage>}
          </label>
          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={submitting || mutation.isPending}>
              {submitting || mutation.isPending ? 'Saving...' : note ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
