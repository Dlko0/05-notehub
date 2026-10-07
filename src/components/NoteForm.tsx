import { Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import type { Note, NotePayload } from '../types/note';

interface NoteFormProps {
  note?: Note;
  onSubmit: (payload: NotePayload) => Promise<unknown>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const schema = Yup.object({
  title: Yup.string().trim().min(1, 'Title is required').max(120, 'Too long'),
  content: Yup.string().trim().min(1, 'Content is required').max(5000, 'Too long'),
});

export function NoteForm({ note, onSubmit, onCancel, isSubmitting = false }: NoteFormProps) {
  return (
    <Formik
      initialValues={{ title: note?.title ?? '', content: note?.content ?? '' }}
      validationSchema={schema}
      onSubmit={async (values: NotePayload, helpers: FormikHelpers<NotePayload>) => {
        try {
          await onSubmit({ title: values.title.trim(), content: values.content.trim() });
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
          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={submitting || isSubmitting}>
              {submitting || isSubmitting ? 'Saving...' : note ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
