import { Button, Icon } from '@ogcio/design-system-react';
import { useState } from 'react';

import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import type { ListId } from '../../state/types';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

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
  const [clearOpen, setClearOpen] = useState(false);

  if (total === 0) return null;

  const showCompleted = state.filters.showCompleted;
  const clearBody =
    listId === null
      ? t('summary.confirmClearAll', { count: completed })
      : t('summary.confirmClearList', { count: completed, name: listName });

  function confirmClear() {
    dispatch({ type: 'CLEAR_COMPLETED', payload: { listId } });
    setClearOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
      <p className="text-sm text-gray-600 tabular-nums">
        {t('summary.progress', { completed, total })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="flat"
          size="sm"
          disabled={completed === 0}
          onClick={() => setClearOpen(true)}
          className="dark:text-emerald-50"
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
            className="dark:border-emerald-50 dark:text-emerald-50"
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
      <ConfirmModal
        isOpen={clearOpen}
        title={t('summary.confirmClearTitle')}
        body={clearBody}
        confirmLabel={t('summary.clear')}
        onConfirm={confirmClear}
        onCancel={() => setClearOpen(false)}
      />
    </div>
  );
}
