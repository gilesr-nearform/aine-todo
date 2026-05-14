import { Button, Heading, Icon, IconButton, InputText } from '@ogcio/design-system-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import type { Filters, ListId, SmartView, Todo } from '../../state/types';
import { countCompleted } from '../../utils/todoCounts';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { ListControls } from '../ListControls/ListControls';
import { ListSummary } from '../ListSummary/ListSummary';
import { TodoItem } from '../TodoItem/TodoItem';

function matchesSearch(todo: Todo, filters: Filters): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query.length === 0) return true;
  const haystack = `${todo.description} ${todo.notes ?? ''}`.toLowerCase();
  return haystack.includes(query);
}

function inScope(
  todo: Todo,
  activeListId: ListId | null,
  activeSmartView: SmartView,
): boolean {
  if (activeListId !== null) return todo.listId === activeListId;
  if (activeSmartView === 'completed') return todo.completed;
  return true;
}

function activeListName(
  activeListId: ListId | null,
  activeSmartView: SmartView,
  lists: ReturnType<typeof useTodos>['state']['lists'],
  fallbackAll: string,
  fallbackCompleted: string,
): string {
  if (activeListId === null) {
    return activeSmartView === 'completed' ? fallbackCompleted : fallbackAll;
  }
  const found = lists.find((l) => l.id === activeListId);
  return found?.name ?? fallbackAll;
}

export function TodoList() {
  const { state, dispatch } = useTodos();
  const t = useT();
  const [renamingActiveList, setRenamingActiveList] = useState(false);
  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [prevActiveListId, setPrevActiveListId] = useState(state.activeListId);
  if (prevActiveListId !== state.activeListId) {
    setPrevActiveListId(state.activeListId);
    setRenamingActiveList(false);
    setDeleteListOpen(false);
  }

  const isCompletedSmartView =
    state.activeListId === null && state.activeSmartView === 'completed';

  const inScopeTodos = state.todos.filter((tt) =>
    inScope(tt, state.activeListId, state.activeSmartView),
  );

  const searchActive = state.filters.search.trim().length > 0;
  const completionFilterActive =
    !isCompletedSmartView && !state.filters.showCompleted;
  const filtersActive = searchActive || completionFilterActive;

  const visibleTodos = inScopeTodos.filter((tt) => {
    if (!matchesSearch(tt, state.filters)) return false;
    if (completionFilterActive && tt.completed) return false;
    return true;
  });

  const listName = activeListName(
    state.activeListId,
    state.activeSmartView,
    state.lists,
    t('list.allTasksHeading'),
    t('sidebar.completed'),
  );
  const completed = countCompleted(inScopeTodos);

  const isUserList = state.activeListId !== null;
  const activeList =
    state.activeListId !== null
      ? state.lists.find((l) => l.id === state.activeListId)
      : undefined;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        {isUserList && renamingActiveList && activeList !== undefined ? (
          <ListTitleRename
            list={activeList}
            onDone={() => setRenamingActiveList(false)}
          />
        ) : (
          <>
            <Heading as="h2" size="md">
              {listName}
            </Heading>
            {isUserList && activeList !== undefined ? (
              <div className="flex items-center gap-1">
                <IconButton
                  type="button"
                  variant="flat"
                  size="sm"
                  ariaLabel={t('sidebar.rename', { name: activeList.name })}
                  onClick={() => setRenamingActiveList(true)}
                  className="dark:!text-gray-200"
                >
                  <Icon icon="edit" size="sm" ariaHidden />
                </IconButton>
                <IconButton
                  type="button"
                  variant="flat"
                  size="sm"
                  ariaLabel={t('sidebar.delete', { name: activeList.name })}
                  onClick={() => setDeleteListOpen(true)}
                  className="dark:!text-gray-200"
                >
                  <Icon icon="delete" size="sm" ariaHidden />
                </IconButton>
              </div>
            ) : null}
          </>
        )}
      </div>
      <ListSummary
        total={inScopeTodos.length}
        completed={completed}
        listId={state.activeListId}
        listName={listName}
        hideShowCompletedToggle={isCompletedSmartView}
      />
      <ListControls />
      {inScopeTodos.length === 0 ? (
        <p className="py-6 text-base text-gray-700">
          {isCompletedSmartView
            ? t('state.noCompletedYet')
            : state.activeListId === null
              ? t('state.emptyBodyGeneric')
              : t('state.emptyBodyForList', { list: listName })}
        </p>
      ) : visibleTodos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-base text-gray-700">{t('state.noMatches')}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              dispatch({ type: 'SET_SEARCH', payload: { value: '' } });
              dispatch({
                type: 'SET_SHOW_COMPLETED',
                payload: { value: true },
              });
            }}
          >
            {t('state.resetFilters')}
          </Button>
        </div>
      ) : (
        <ul className="list-none p-0">
          {visibleTodos.map((todo) => {
            const scopeIndex = inScopeTodos.findIndex((tt) => tt.id === todo.id);
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                index={scopeIndex}
                total={inScopeTodos.length}
                reorderDisabled={filtersActive || isCompletedSmartView}
              />
            );
          })}
        </ul>
      )}
      {activeList !== undefined ? (
        <ConfirmModal
          isOpen={deleteListOpen}
          title={t('sidebar.confirmDeleteTitle')}
          body={t('sidebar.confirmDelete', { name: activeList.name })}
          confirmLabel={t('sidebar.delete', { name: activeList.name })}
          onConfirm={() => {
            dispatch({ type: 'DELETE_LIST', payload: { id: activeList.id } });
            setDeleteListOpen(false);
          }}
          onCancel={() => setDeleteListOpen(false)}
        />
      ) : null}
    </div>
  );
}

interface ListTitleRenameProps {
  list: { id: ListId; name: string };
  onDone: () => void;
}

function ListTitleRename({ list, onDone }: ListTitleRenameProps) {
  const { dispatch } = useTodos();
  const t = useT();
  const [value, setValue] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function save() {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      onDone();
      return;
    }
    dispatch({ type: 'RENAME_LIST', payload: { id: list.id, name: trimmed } });
    onDone();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      save();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onDone();
    }
  }

  return (
    <div className="flex w-full items-center gap-2">
      <label className="sr-only" htmlFor={`rename-title-${list.id}`}>
        {t('sidebar.renameInputLabel', { name: list.name })}
      </label>
      <div className="flex-1">
        <InputText
          id={`rename-title-${list.id}`}
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>
      <Button type="button" variant="secondary" size="sm" onMouseDown={save}>
        {t('sidebar.save')}
      </Button>
      <Button type="button" variant="flat" size="sm" onMouseDown={onDone}>
        {t('sidebar.cancel')}
      </Button>
    </div>
  );
}
