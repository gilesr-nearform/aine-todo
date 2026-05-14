import {
  Button,
  Icon,
  InputText,
  SideNav,
  SideNavHeading,
  SideNavItem,
} from '@ogcio/design-system-react';
import type { ComponentProps } from 'react';
import {
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import { ThemeIcon, useThemeToggle } from '../AppShell/ThemeToggle';
import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import type { ListId } from '../../state/types';

const SMART_ALL_VALUE = '__all__';
const SMART_COMPLETED_VALUE = '__completed__';

/*
 * Gov.ie types `SideNavItem.icon` to its curated set of ~80 names, but the
 * underlying Icon component falls through to a Material Symbols font ligature
 * for any unknown name. Since the index.html loads the full Material Symbols
 * Outlined font, names like `format_list_bulleted` render correctly at
 * runtime. We narrow the cast to one place rather than scatter `as` calls.
 */
type SideNavIcon = ComponentProps<typeof SideNavItem>['icon'];
const ALL_TASKS_ICON = 'list' as SideNavIcon;

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { state, dispatch } = useTodos();
  const t = useT();
  const themeToggle = useThemeToggle();
  const [draft, setDraft] = useState('');
  const newListInputId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const counts = useMemo(() => {
    const byList = new Map<ListId, number>();
    let completed = 0;
    for (const todo of state.todos) {
      byList.set(todo.listId, (byList.get(todo.listId) ?? 0) + 1);
      if (todo.completed) completed += 1;
    }
    return { all: state.todos.length, completed, byList };
  }, [state.todos]);

  if (state.status !== 'success') return null;

  function handleSelect(value: string) {
    if (value === SMART_ALL_VALUE) {
      dispatch({ type: 'SET_SMART_VIEW', payload: { view: 'all' } });
    } else if (value === SMART_COMPLETED_VALUE) {
      dispatch({ type: 'SET_SMART_VIEW', payload: { view: 'completed' } });
    } else {
      dispatch({ type: 'SET_ACTIVE_LIST', payload: { id: value as ListId } });
    }
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

  const selectedValue =
    state.activeListId !== null
      ? state.activeListId
      : state.activeSmartView === 'completed'
        ? SMART_COMPLETED_VALUE
        : SMART_ALL_VALUE;

  return (
    <nav
      aria-label={t('sidebar.aria')}
      className="flex h-full w-full flex-col border-r border-gray-200 bg-white md:w-[260px]"
    >
      {/*
        Two-region sidebar: the list rail at the top is the only scrollable
        area; the footer (Add list + theme toggle) is pinned to the bottom
        regardless of how many lists exist. `min-h-0` on the scroll region is
        required so flex children don't blow out the column height in Safari.
      */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <SideNav
          value={selectedValue}
          onChange={handleSelect}
          key={selectedValue}
        >
          <div className="relative">
            <SideNavItem
              value={SMART_ALL_VALUE}
              label={t('sidebar.allTasks')}
              icon={ALL_TASKS_ICON}
            />
            {counts.all > 0 ? <CountBadge count={counts.all} /> : null}
          </div>
          <div className="relative">
            <SideNavItem
              value={SMART_COMPLETED_VALUE}
              label={t('sidebar.completed')}
              icon="check_circle"
            />
            {counts.completed > 0 ? <CountBadge count={counts.completed} /> : null}
          </div>
          <SideNavHeading as="h2">{t('sidebar.myLists')}</SideNavHeading>
          {state.lists.map((list) => {
            const count = counts.byList.get(list.id) ?? 0;
            return (
              <div key={list.id} className="relative">
                <SideNavItem value={list.id} label={list.name} />
                {count > 0 ? <CountBadge count={count} /> : null}
              </div>
            );
          })}
        </SideNav>
      </div>
      <div className="flex flex-col gap-2 border-t border-gray-200 p-3">
        <form
          ref={formRef}
          onSubmit={handleCreate}
          className="flex flex-col gap-2"
          aria-label={t('sidebar.addList')}
        >
          <label htmlFor={newListInputId} className="sr-only">
            {t('sidebar.newListLabel')}
          </label>
          <InputText
            id={newListInputId}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('sidebar.newListPlaceholder')}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={draft.trim().length === 0}
          >
            <Icon icon="add_circle" size="sm" ariaHidden />
            <span>{t('sidebar.addList')}</span>
          </Button>
        </form>
        <button
          type="button"
          onClick={themeToggle.toggle}
          aria-pressed={themeToggle.isDark}
          className="flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:text-gray-200 dark:hover:bg-gray-200/40"
        >
          <span className="flex h-5 w-5 items-center justify-center text-current">
            <ThemeIcon isDark={themeToggle.isDark} />
          </span>
          <span>{themeToggle.label}</span>
        </button>
      </div>
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
      className={`pointer-events-none absolute right-3 top-1/2 z-100 -translate-y-1/2 text-xs font-medium tabular-nums text-gray-600 transition-opacity ${className ?? ''}`.trim()}
    >
      {count}
    </span>
  );
}
