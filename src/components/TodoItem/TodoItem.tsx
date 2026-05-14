import { InputCheckbox } from '@ogcio/design-system-react';
import { useId } from 'react';
import { useTodos } from '../../state/TodosContext';
import type { Todo } from '../../state/types';
import { formatCreatedAt } from '../../utils/formatTimestamp';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useTodos();
  const checkboxId = useId();

  return (
    <li className="flex items-start gap-3 border-b border-gray-200 py-3 last:border-b-0">
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
    </li>
  );
}
