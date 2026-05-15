import { Icon, IconButton, InputCheckbox } from '@ogcio/design-system-react';
import { useId, useState, type KeyboardEvent } from 'react';

import { useI18n } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import type { Todo } from '../../state/types';
import { describeCreatedAt } from '../../utils/formatTimestamp';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { TodoDeleteAction } from '../TodoDeleteAction/TodoDeleteAction';
import { TodoEditor } from '../TodoEditor/TodoEditor';
import { TodoReorderActions } from '../TodoReorderActions/TodoReorderActions';

interface TodoItemProps {
  todo: Todo;
  index: number;
  total: number;
  reorderDisabled?: boolean;
  // Set by `TodoList` when this row has just been ticked and auto-hide is
  // active. While true, the row stays in the DOM and runs the
  // `todo-row-exit` animation defined in `globals.css`. The parent will
  // filter it out once the animation completes.
  exiting?: boolean;
}

export function TodoItem({
  todo,
  index,
  total,
  reorderDisabled = false,
  exiting = false,
}: TodoItemProps) {
  const { state, dispatch } = useTodos();
  const { t, locale } = useI18n();
  const checkboxId = useId();
  const isEditing = state.editingId === todo.id;
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  function requestDelete() {
    setConfirmDeleteOpen(true);
  }

  function confirmDelete() {
    setConfirmDeleteOpen(false);
    dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (isEditing) return;
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    const target = event.target as HTMLElement;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      // Inside an input or textarea, Delete/Backspace edits the field. Only the
      // completion checkbox (a non-text input) should trigger row delete.
      if (tag === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
        event.preventDefault();
        requestDelete();
      }
      return;
    }
    event.preventDefault();
    requestDelete();
  }

  const createdAt = describeCreatedAt(todo.createdAt, locale);
  const createdAtLabel =
    createdAt.kind === 'time'
      ? t('todo.createdAtTime', { time: createdAt.value })
      : t('todo.createdAtDate', { date: createdAt.value });

  return (
    <li
      className={
        'todo-row-enter group flex flex-col gap-1 border-b border-gray-200 py-3 last:border-b-0' +
        (exiting ? ' todo-row-exit' : '')
      }
      aria-hidden={exiting ? true : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start gap-3">
        <InputCheckbox
          id={checkboxId}
          checked={todo.completed}
          onChange={() =>
            dispatch({ type: 'TOGGLE_COMPLETE', payload: { id: todo.id } })
          }
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label
            htmlFor={checkboxId}
            className={
              todo.completed
                ? 'cursor-pointer text-base text-gray-500 line-through transition-colors duration-200 motion-reduce:transition-none'
                : 'cursor-pointer text-base text-gray-900 transition-colors duration-200 motion-reduce:transition-none'
            }
          >
            {todo.description}
          </label>
          {!isEditing && todo.notes !== undefined && todo.notes !== '' ? (
            <p className="line-clamp-2 whitespace-pre-line text-sm text-gray-600">
              {todo.notes}
            </p>
          ) : null}
          <span className="text-xs text-gray-600">{createdAtLabel}</span>
        </div>
        {!isEditing ? (
          <div className="flex items-start gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <IconButton
              type="button"
              variant="flat"
              size="sm"
              ariaLabel={t('todo.edit', { description: todo.description })}
              onClick={() =>
                dispatch({ type: 'START_EDIT', payload: { id: todo.id } })
              }
            >
              <Icon icon="edit" size="sm" ariaHidden />
            </IconButton>
            <TodoReorderActions
              id={todo.id}
              description={todo.description}
              index={index}
              total={total}
              disabled={reorderDisabled}
            />
            <TodoDeleteAction
              description={todo.description}
              onDelete={requestDelete}
            />
          </div>
        ) : null}
      </div>
      {isEditing ? <TodoEditor todo={todo} /> : null}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title={t('todo.confirmDeleteTitle')}
        body={t('todo.confirmDelete', { description: todo.description })}
        confirmLabel={t('todo.delete', { description: todo.description })}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </li>
  );
}
