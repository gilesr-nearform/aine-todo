import { Button, InputText, TextArea } from '@ogcio/design-system-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import type { Todo } from '../../state/types';

interface TodoEditorProps {
  todo: Todo;
}

export function TodoEditor({ todo }: TodoEditorProps) {
  const { dispatch } = useTodos();
  const t = useT();
  const descriptionId = useId();
  const notesId = useId();
  const descriptionRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(todo.description);
  const [notes, setNotes] = useState(todo.notes ?? '');

  useEffect(() => {
    descriptionRef.current?.focus();
    descriptionRef.current?.select();
  }, []);

  const trimmedDescription = description.trim();
  const canSave = trimmedDescription.length > 0;

  function save() {
    if (!canSave) return;
    dispatch({
      type: 'UPDATE_TODO',
      payload: {
        id: todo.id,
        description: trimmedDescription,
        notes,
      },
    });
  }

  function cancel() {
    dispatch({ type: 'CANCEL_EDIT' });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      save();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      aria-label={t('todo.edit', { description: todo.description })}
      className="mt-2 flex w-full flex-col gap-3 rounded-md border border-gray-300 bg-gray-100 p-3"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor={descriptionId}
          className="text-xs font-medium text-gray-700"
        >
          {t('editor.description')}
        </label>
        <InputText
          id={descriptionId}
          ref={descriptionRef}
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={notesId} className="text-xs font-medium text-gray-700">
          {t('editor.notes')}
        </label>
        <TextArea
          id={notesId}
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={t('editor.notesPlaceholder')}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" onClick={cancel}>
          {t('editor.cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={!canSave}>
          {t('editor.save')}
        </Button>
      </div>
    </form>
  );
}
