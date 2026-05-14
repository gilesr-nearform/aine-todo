import { useTodos } from '../../state/TodosContext';
import { UndoToast } from './UndoToast';

export function UndoToastContainer() {
  const { state } = useTodos();

  if (state.recentlyDeleted.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none flex w-full flex-col items-center gap-2"
    >
      {state.recentlyDeleted.map((record) => (
        <UndoToast key={record.todo.id} record={record} />
      ))}
    </div>
  );
}
