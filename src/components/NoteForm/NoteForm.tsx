import { Formik, type FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { useCreateNote, useUpdateNote } from '../../hooks/useNotes';
import type { Note, NotePayload } from '../../types/note';

interface NoteFormProps {
  note?: Note;
  onCancel: () => void;
}

const schema = Yup.object({
  title: Yup.string().trim().min(1, 'Title is required').max(120, 'Title must be at most 120 characters'),
  content: Yup.string().trim().min(1, 'Content is required').max(5000, 'Content must be at most 5000 characters'),
  tag: Yup.string().trim().min(1, 'Tag is required').max(40, 'Tag must be at most 40 characters'),
});

export function NoteForm({ note, onCancel }: NoteFormProps) {
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const mutation = note ? updateMutation : createMutation;

  return (
    <Formik
      initialValues={{ title: note?.title ?? '', content: note?.content ?? '', tag: note?.tag ?? '' }}
      validationSchema={schema}
      onSubmit={async (values: NotePayload, helpers: FormikHelpers<NotePayload>) => {
        try {
          const payload = { title: values.title.trim(), content: values.content.trim(), tag: values.tag.trim() };
          if (note) await updateMutation.mutateAsync({ id: note.id, payload });
          else await createMutation.mutateAsync(payload);
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
            {touched.title && errors.title && <small>{errors.title}</small>}
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
            {touched.content && errors.content && <small>{errors.content}</small>}
          </label>
          <label>
            <span>Tag</span>
            <input
              name="tag"
              value={values.tag}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Personal"
              aria-invalid={Boolean(touched.tag && errors.tag)}
            />
            {touched.tag && errors.tag && <small>{errors.tag}</small>}
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
