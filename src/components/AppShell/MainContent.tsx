import { EmptyState } from '../EmptyState/EmptyState';
import { ErrorState } from '../ErrorState/ErrorState';
import { LoadingState } from '../LoadingState/LoadingState';
import { TodoList } from '../TodoList/TodoList';
import { useTodos } from '../../state/TodosContext';

function selectBody(
  status: ReturnType<typeof useTodos>['state']['status'],
  todoCount: number,
): React.ReactNode {
  if (status === 'loading' || status === 'idle') return <LoadingState />;
  if (status === 'error') return <ErrorState />;
  if (todoCount === 0) return <EmptyState />;
  return <TodoList />;
}

export function MainContent() {
  const { state } = useTodos();

  return (
    <main className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6">
      {selectBody(state.status, state.todos.length)}
    </main>
  );
}
