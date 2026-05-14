import { useTodos } from '../../state/TodosContext';

export function TodoList() {
  const { state } = useTodos();

  if (state.todos.length === 0) return null;

  return (
    <div className="flex h-full w-full items-center justify-center text-gray-900">
      Populated
    </div>
  );
}
