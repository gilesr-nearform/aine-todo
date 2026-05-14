import { Button } from '@ogcio/design-system-react';
import { useCallback, useState } from 'react';

import { useUndoTimer } from '../../hooks/useUndoTimer';
import { useT } from '../../i18n/I18nContext';
import type { DeletedRecord, TodoId } from '../../state/types';

interface UndoToastProps {
  record: DeletedRecord;
  durationMs: number;
  onUndo: (id: TodoId) => void;
  onExpire: (id: TodoId) => void;
}

export function UndoToast({
  record,
  durationMs,
  onUndo,
  onExpire,
}: UndoToastProps) {
  const id = record.todo.id;
  const t = useT();
  const handleExpire = useCallback(() => onExpire(id), [onExpire, id]);

  useUndoTimer(record.expiresAt, handleExpire);

  const [remainingMs] = useState(() =>
    Math.max(0, Math.min(durationMs, record.expiresAt - Date.now())),
  );

  return (
    <div className="pointer-events-auto flex w-full max-w-md flex-col gap-2 rounded-md border border-gray-200 bg-gray-900 px-4 py-3 text-gray-50 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 flex-1 truncate text-sm">
          {t('undo.deleted', { description: record.todo.description })}
        </span>
        <Button
          type="button"
          variant="flat"
          appearance="dark"
          size="sm"
          onClick={() => onUndo(id)}
        >
          {t('undo.undo')}
        </Button>
      </div>
      <div
        className="h-0.5 w-full overflow-hidden rounded-full bg-gray-50/20 motion-reduce:hidden"
        aria-hidden
      >
        <div
          className="h-full bg-gray-50/70"
          style={{
            width: '100%',
            animation: `undo-toast-countdown ${remainingMs}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
