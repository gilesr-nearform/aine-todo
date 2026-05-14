import {
  Button,
  Icon,
  IconButton,
  InputText,
  SideNav,
  SideNavHeading,
  SideNavItem,
} from '@ogcio/design-system-react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useTodos } from '../../state/TodosContext';
import type { List, ListId } from '../../state/types';

const SMART_ALL_VALUE = '__all__';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { state, dispatch } = useTodos();
  const [draft, setDraft] = useState('');
  const [renamingId, setRenamingId] = useState<ListId | null>(null);
  const newListInputId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const counts = useMemo(() => {
    const byList = new Map<ListId, number>();
    for (const todo of state.todos) {
      byList.set(todo.listId, (byList.get(todo.listId) ?? 0) + 1);
    }
    return { all: state.todos.length, byList };
  }, [state.todos]);

  if (state.status !== 'success') return null;

  function handleSelect(value: string) {
    const nextId = value === SMART_ALL_VALUE ? null : (value as ListId);
    dispatch({ type: 'SET_ACTIVE_LIST', payload: { id: nextId } });
    onNavigate?.();
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (trimmed.length === 0) return;
    dispatch({ type: 'CREATE_LIST', payload: { name: trimmed } });
    setDraft('');
    onNavigate?.();
  }

  function handleDelete(list: List) {
    const message = `Delete '${list.name}' and its tasks? Tasks in this list will be permanently removed.`;
    if (!window.confirm(message)) return;
    dispatch({ type: 'DELETE_LIST', payload: { id: list.id } });
  }

  const selectedValue =
    state.activeListId === null ? SMART_ALL_VALUE : state.activeListId;

  return (
    <nav
      aria-label="Lists"
      className="flex w-full flex-col gap-3 border-r border-gray-200 bg-white p-3 md:h-full md:w-[260px]"
    >
      <SideNav
        value={selectedValue}
        onChange={handleSelect}
        key={selectedValue}
      >
        <SideNavHeading as="h2">Smart</SideNavHeading>
        <div className="relative">
          <SideNavItem value={SMART_ALL_VALUE} label="All tasks" icon="apps" />
          {counts.all > 0 ? <CountBadge count={counts.all} /> : null}
        </div>
        <SideNavHeading as="h2">My lists</SideNavHeading>
        {state.lists.map((list) => {
          const count = counts.byList.get(list.id) ?? 0;
          if (renamingId === list.id) {
            return (
              <RenameRow
                key={list.id}
                list={list}
                onCancel={() => setRenamingId(null)}
                onSaved={() => setRenamingId(null)}
              />
            );
          }
          return (
            <div
              key={list.id}
              className="group/list relative flex items-center gap-1"
            >
              <div className="flex-1">
                <SideNavItem value={list.id} label={list.name} />
              </div>
              {count > 0 ? (
                <CountBadge
                  count={count}
                  className="sm:group-hover/list:opacity-0 sm:group-focus-within/list:opacity-0"
                />
              ) : null}
              <div className="absolute right-1 flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover/list:opacity-100 sm:group-focus-within/list:opacity-100">
                <IconButton
                  type="button"
                  variant="flat"
                  size="sm"
                  ariaLabel={`Rename '${list.name}'`}
                  onClick={() => setRenamingId(list.id)}
                >
                  <Icon icon="edit" size="sm" ariaHidden />
                </IconButton>
                <IconButton
                  type="button"
                  variant="flat"
                  size="sm"
                  ariaLabel={`Delete '${list.name}'`}
                  onClick={() => handleDelete(list)}
                >
                  <Icon icon="delete" size="sm" ariaHidden />
                </IconButton>
              </div>
            </div>
          );
        })}
      </SideNav>
      <form
        ref={formRef}
        onSubmit={handleCreate}
        className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3"
        aria-label="Add a list"
      >
        <label htmlFor={newListInputId} className="sr-only">
          New list name
        </label>
        <InputText
          id={newListInputId}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="New list name"
          autoComplete="off"
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={draft.trim().length === 0}
        >
          Add list
        </Button>
      </form>
    </nav>
  );
}

interface CountBadgeProps {
  count: number;
  className?: string;
}

function CountBadge({ count, className }: CountBadgeProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums text-gray-500 transition-opacity ${className ?? ''}`.trim()}
    >
      {count}
    </span>
  );
}

interface RenameRowProps {
  list: List;
  onCancel: () => void;
  onSaved: () => void;
}

function RenameRow({ list, onCancel, onSaved }: RenameRowProps) {
  const { dispatch } = useTodos();
  const [value, setValue] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function save() {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      onCancel();
      return;
    }
    dispatch({ type: 'RENAME_LIST', payload: { id: list.id, name: trimmed } });
    onSaved();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      save();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <label className="sr-only" htmlFor={`rename-${list.id}`}>
        Rename list
      </label>
      <InputText
        id={`rename-${list.id}`}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
    </div>
  );
}
