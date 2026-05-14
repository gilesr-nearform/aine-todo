import { useTodos } from '../../state/TodosContext';
import type { TodoId } from '../../state/types';
import { UndoToast } from './UndoToast';

export function UndoToastContainer() {
  const { state, dispatch } = useTodos();

  if (state.recentlyDeleted.length === 0) return null;

  function handleUndo(id: TodoId) {
    dispatch({ type: 'UNDO_DELETE', payload: { id } });
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none flex w-full flex-col items-center gap-2"
    >
      {state.recentlyDeleted.map((record) => (
        <UndoToast key={record.todo.id} record={record} onUndo={handleUndo} />
      ))}
    </div>
  );
}
