import { InputCheckbox } from '@ogcio/design-system-react';
import { useId, type KeyboardEvent } from 'react';
import { useTodos } from '../../state/TodosContext';
import type { Todo } from '../../state/types';
import { formatCreatedAt } from '../../utils/formatTimestamp';
import { TodoDeleteAction } from '../TodoDeleteAction/TodoDeleteAction';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useTodos();
  const checkboxId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    const target = event.target as HTMLElement;
    const tag = target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      if (tag === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
        event.preventDefault();
        dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
      }
      return;
    }
    event.preventDefault();
    dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
  }

  return (
    <li
      className="group flex items-start gap-3 border-b border-gray-200 py-3 last:border-b-0"
      onKeyDown={handleKeyDown}
    >
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
              ? 'cursor-pointer text-base text-gray-500 line-through'
              : 'cursor-pointer text-base text-gray-900'
          }
        >
          {todo.description}
        </label>
        <span className="text-xs text-gray-500">
          {formatCreatedAt(todo.createdAt)}
        </span>
      </div>
      <TodoDeleteAction
        id={todo.id}
        description={todo.description}
        className="opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
      />
    </li>
  );
}
