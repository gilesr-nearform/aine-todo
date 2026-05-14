import { InputCheckbox } from '@ogcio/design-system-react';
import { useId } from 'react';
import type { Todo } from '../../state/types';
import { formatCreatedAt } from '../../utils/formatTimestamp';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const labelId = useId();

  return (
    <li className="flex items-start gap-3 border-b border-gray-200 py-3 last:border-b-0">
      <InputCheckbox
        checked={todo.completed}
        onChange={() => {}}
        aria-labelledby={labelId}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          id={labelId}
          className={
            todo.completed
              ? 'text-base text-gray-500 line-through'
              : 'text-base text-gray-900'
          }
        >
          {todo.description}
        </span>
        <span className="text-xs text-gray-500">
          {formatCreatedAt(todo.createdAt)}
        </span>
      </div>
    </li>
  );
}
