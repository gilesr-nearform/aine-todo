import { Icon, IconButton } from '@ogcio/design-system-react';
import { useTodos } from '../../state/TodosContext';
import type { TodoId } from '../../state/types';

interface TodoReorderActionsProps {
  id: TodoId;
  description: string;
  index: number;
  total: number;
  disabled?: boolean;
  className?: string;
}

export function TodoReorderActions({
  id,
  description,
  index,
  total,
  disabled = false,
  className,
}: TodoReorderActionsProps) {
  const { dispatch } = useTodos();
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`.trim()}>
      <IconButton
        type="button"
        variant="flat"
        size="sm"
        ariaLabel={`Move '${description}' up`}
        disabled={disabled || isFirst}
        onClick={() =>
          dispatch({
            type: 'REORDER_TODO',
            payload: { id, direction: 'up' },
          })
        }
      >
        <Icon icon="arrow_upward" size="sm" ariaHidden />
      </IconButton>
      <IconButton
        type="button"
        variant="flat"
        size="sm"
        ariaLabel={`Move '${description}' down`}
        disabled={disabled || isLast}
        onClick={() =>
          dispatch({
            type: 'REORDER_TODO',
            payload: { id, direction: 'down' },
          })
        }
      >
        <Icon icon="arrow_downward" size="sm" ariaHidden />
      </IconButton>
    </div>
  );
}
