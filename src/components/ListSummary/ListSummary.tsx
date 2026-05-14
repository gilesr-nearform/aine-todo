import { Button, Icon } from '@ogcio/design-system-react';

import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import type { ListId } from '../../state/types';

interface ListSummaryProps {
  total: number;
  completed: number;
  listId: ListId | null;
  listName: string;
  hideShowCompletedToggle?: boolean;
}

export function ListSummary({
  total,
  completed,
  listId,
  listName,
  hideShowCompletedToggle = false,
}: ListSummaryProps) {
  const { state, dispatch } = useTodos();
  const t = useT();

  if (total === 0) return null;

  const showCompleted = state.filters.showCompleted;

  function handleClear() {
    const message =
      listId === null
        ? t('summary.confirmClearAll', { count: completed })
        : t('summary.confirmClearList', { count: completed, name: listName });
    if (!window.confirm(message)) return;
    dispatch({ type: 'CLEAR_COMPLETED', payload: { listId } });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
      <p className="text-sm text-gray-600 tabular-nums">
        {t('summary.progress', { completed, total })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={completed === 0}
          onClick={handleClear}
        >
          {t('summary.clear')}
        </Button>
        {hideShowCompletedToggle ? null : (
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
              {showCompleted ? t('summary.hide') : t('summary.show')}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
