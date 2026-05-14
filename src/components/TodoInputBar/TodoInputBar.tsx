import { Button, InputText } from '@ogcio/design-system-react';
import { useId, useRef, useState, type FormEvent } from 'react';
import { useTodos } from '../../state/TodosContext';

export function TodoInputBar() {
  const { state, dispatch } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [draft, setDraft] = useState('');

  const ready = state.status === 'success';
  const trimmed = draft.trim();
  const canSubmit = ready && trimmed.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    dispatch({ type: 'CREATE_TODO', payload: { description: trimmed } });
    setDraft('');
    inputRef.current?.focus();
  }

  return (
    <form
      className="flex w-full items-end gap-3"
      onSubmit={handleSubmit}
      aria-label="Add a task"
    >
      <div className="flex-1">
        <label htmlFor={inputId} className="sr-only">
          Task description
        </label>
        <InputText
          id={inputId}
          ref={inputRef}
          name="todo-input"
          type="text"
          placeholder="Add a task"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!ready}
          autoComplete="off"
        />
      </div>
      <Button type="submit" variant="primary" disabled={!canSubmit}>
        Add
      </Button>
    </form>
  );
}
