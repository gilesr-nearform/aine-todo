import { Button, Icon } from '@ogcio/design-system-react';
import { useTodos } from '../../state/TodosContext';
import type { ListId } from '../../state/types';

interface ListSummaryProps {
  total: number;
  completed: number;
  listId: ListId | null;
  listName: string;
}

function buildClearMessage(
  listId: ListId | null,
  listName: string,
  completed: number,
): string {
  const noun = completed === 1 ? 'task' : 'tasks';
  if (listId === null) {
    return `Clear ${String(completed)} completed ${noun} across all lists? This can't be undone.`;
  }
  return `Clear ${String(completed)} completed ${noun} in '${listName}'? This can't be undone.`;
}

export function ListSummary({
  total,
  completed,
  listId,
  listName,
}: ListSummaryProps) {
  const { state, dispatch } = useTodos();

  if (total === 0) return null;

  const showCompleted = state.filters.showCompleted;

  function handleClear() {
    const message = buildClearMessage(listId, listName, completed);
    if (!window.confirm(message)) return;
    dispatch({ type: 'CLEAR_COMPLETED', payload: { listId } });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
      <p className="text-sm text-gray-600">
        <span className="tabular-nums">{completed}</span> of{' '}
        <span className="tabular-nums">{total}</span> completed
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={completed === 0}
          onClick={handleClear}
        >
          Clear completed
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          aria-pressed={!showCompleted}
          onClick={() =>
            dispatch({
              type: 'SET_SHOW_COMPLETED',
              payload: { value: !showCompleted },
            })
          }
        >
          <Icon
            icon={showCompleted ? 'visibility_off' : 'visibility'}
            size="sm"
            ariaHidden
          />
          <span className="ml-1">
            {showCompleted ? 'Hide completed' : 'Show completed'}
          </span>
        </Button>
      </div>
    </div>
  );
}

