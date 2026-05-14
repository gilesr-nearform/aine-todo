import { Button } from '@ogcio/design-system-react';
import { useTodos } from '../../state/TodosContext';
import { defaultFilters, type Filters, type Todo } from '../../state/types';
import { TodoItem } from '../TodoItem/TodoItem';

function filtersAreDefault(filters: Filters): boolean {
  return (
    filters.search === defaultFilters.search &&
    filters.flaggedOnly === defaultFilters.flaggedOnly &&
    filters.showCompleted === defaultFilters.showCompleted
  );
}

function matchesFilters(todo: Todo, filters: Filters): boolean {
  if (!filters.showCompleted && todo.completed) return false;
  if (filters.flaggedOnly && !todo.flagged) return false;
  const query = filters.search.trim().toLowerCase();
  if (query.length > 0) {
    const haystack = `${todo.description} ${todo.notes ?? ''}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

export function TodoList() {
  const { state, dispatch } = useTodos();

  if (state.todos.length === 0) return null;

  const filtersActive = !filtersAreDefault(state.filters);
  const visibleTodos = filtersActive
    ? state.todos.filter((todo) => matchesFilters(todo, state.filters))
    : state.todos;

  if (visibleTodos.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 py-8 text-center">
        <p className="text-base text-gray-700">
          No tasks match your filters.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            dispatch({ type: 'SET_SEARCH', payload: { value: '' } });
            dispatch({
              type: 'SET_FLAGGED_ONLY',
              payload: { value: false },
            });
            dispatch({
              type: 'SET_SHOW_COMPLETED',
              payload: { value: true },
            });
          }}
        >
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <ul className="mx-auto w-full max-w-2xl list-none p-0">
      {visibleTodos.map((todo) => {
        const fullIndex = state.todos.findIndex((t) => t.id === todo.id);
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={fullIndex}
            total={state.todos.length}
            reorderDisabled={filtersActive}
          />
        );
      })}
    </ul>
  );
}
