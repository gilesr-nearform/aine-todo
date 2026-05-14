import { Button, Heading } from '@ogcio/design-system-react';
import { useTodos } from '../../state/TodosContext';
import {
  defaultFilters,
  type Filters,
  type ListId,
  type Todo,
} from '../../state/types';
import { countCompleted } from '../../utils/todoCounts';
import { ListControls } from '../ListControls/ListControls';
import { ListSummary } from '../ListSummary/ListSummary';
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

function matchesList(todo: Todo, activeListId: ListId | null): boolean {
  if (activeListId === null) return true;
  return todo.listId === activeListId;
}

function activeListName(
  activeListId: ListId | null,
  lists: ReturnType<typeof useTodos>['state']['lists'],
): string {
  if (activeListId === null) return 'All tasks';
  const found = lists.find((l) => l.id === activeListId);
  return found?.name ?? 'All tasks';
}

export function TodoList() {
  const { state, dispatch } = useTodos();

  const filtersActive = !filtersAreDefault(state.filters);
  const inList = state.todos.filter((t) => matchesList(t, state.activeListId));
  const visibleTodos = filtersActive
    ? inList.filter((t) => matchesFilters(t, state.filters))
    : inList;
  const listName = activeListName(state.activeListId, state.lists);
  const completed = countCompleted(inList);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <Heading as="h2" size="md">
        {listName}
      </Heading>
      <ListSummary
        total={inList.length}
        completed={completed}
        listId={state.activeListId}
        listName={listName}
      />
      <ListControls />
      {inList.length === 0 ? (
        <p className="py-6 text-base text-gray-700">
          {state.activeListId === null
            ? 'No tasks yet. Add one below.'
            : `No tasks in ${listName} yet. Add one below.`}
        </p>
      ) : visibleTodos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
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
      ) : (
        <ul className="list-none p-0">
          {visibleTodos.map((todo) => {
            const inListIndex = inList.findIndex((t) => t.id === todo.id);
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                index={inListIndex}
                total={inList.length}
                reorderDisabled={filtersActive}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
