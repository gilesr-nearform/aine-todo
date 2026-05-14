import { useCallback } from 'react';
import { useTodos } from '../../state/TodosContext';
import type { TodoId } from '../../state/types';
import { UndoToast } from './UndoToast';

const UNDO_WINDOW_MS = 4000;

export function UndoToastContainer() {
  const { state, dispatch } = useTodos();

  const handleUndo = useCallback(
    (id: TodoId) => dispatch({ type: 'UNDO_DELETE', payload: { id } }),
    [dispatch],
  );
  const handleExpire = useCallback(
    (id: TodoId) => dispatch({ type: 'EXPIRE_DELETED', payload: { id } }),
    [dispatch],
  );

  if (state.recentlyDeleted.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none flex w-full flex-col items-center gap-2"
    >
      {state.recentlyDeleted.map((record) => (
        <UndoToast
          key={record.todo.id}
          record={record}
          durationMs={UNDO_WINDOW_MS}
          onUndo={handleUndo}
          onExpire={handleExpire}
        />
      ))}
    </div>
  );
}
