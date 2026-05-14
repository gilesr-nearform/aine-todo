import type { List, ListId, Todo } from './types';

export const V1_KEY = 'listlens:v1:todos';
export const STORAGE_KEY = 'listlens:v2:state';
export const DEFAULT_LIST_NAME = 'Tasks';

interface PersistedList {
  id: string;
  name: string;
  createdAt: string;
}

interface PersistedTodo {
  id: string;
  listId?: string;
  description: string;
  completed: boolean;
  createdAt: string;
  notes?: string;
  flagged?: boolean;
}

interface PersistedState {
  lists: PersistedList[];
  todos: PersistedTodo[];
  activeListId: string | null;
}

export interface LoadedState {
  lists: List[];
  todos: Todo[];
  activeListId: ListId | null;
}

function isPersistedList(value: unknown): value is PersistedList {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.createdAt === 'string'
  );
}

function isPersistedTodo(value: unknown): value is PersistedTodo {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  if (
    typeof record.id !== 'string' ||
    typeof record.description !== 'string' ||
    typeof record.completed !== 'boolean' ||
    typeof record.createdAt !== 'string'
  ) {
    return false;
  }
  if (record.listId !== undefined && typeof record.listId !== 'string') {
    return false;
  }
  if (record.notes !== undefined && typeof record.notes !== 'string') {
    return false;
  }
  if (record.flagged !== undefined && typeof record.flagged !== 'boolean') {
    return false;
  }
  return true;
}

function isPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.lists) &&
    Array.isArray(record.todos) &&
    (record.activeListId === null || typeof record.activeListId === 'string')
  );
}

function hydrateTodo(entry: PersistedTodo, fallbackListId: ListId): Todo {
  return {
    id: entry.id,
    listId: entry.listId ?? fallbackListId,
    description: entry.description,
    completed: entry.completed,
    createdAt: new Date(entry.createdAt),
    ...(entry.notes !== undefined && entry.notes !== ''
      ? { notes: entry.notes }
      : {}),
    flagged: entry.flagged ?? false,
  };
}

function emptyState(): LoadedState {
  const defaultList: List = {
    id: crypto.randomUUID(),
    name: DEFAULT_LIST_NAME,
    createdAt: new Date(),
  };
  return {
    lists: [defaultList],
    todos: [],
    activeListId: defaultList.id,
  };
}

function migrateV1(): LoadedState | null {
  const raw = localStorage.getItem(V1_KEY);
  if (raw === null || raw === '') return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const defaultList: List = {
      id: crypto.randomUUID(),
      name: DEFAULT_LIST_NAME,
      createdAt: new Date(),
    };
    const todos: Todo[] = [];
    for (const entry of parsed) {
      if (!isPersistedTodo(entry)) continue;
      todos.push(hydrateTodo(entry, defaultList.id));
    }
    console.info(
      `[${STORAGE_KEY}] migrated ${String(todos.length)} todos from v1 into "${DEFAULT_LIST_NAME}".`,
    );
    return {
      lists: [defaultList],
      todos,
      activeListId: defaultList.id,
    };
  } catch (err) {
    console.warn(`[${V1_KEY}] failed to migrate from v1:`, err);
    return null;
  }
}

export function readFromStorage(): LoadedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null && raw !== '') {
      const parsed: unknown = JSON.parse(raw);
      if (!isPersistedState(parsed)) {
        console.warn(`[${STORAGE_KEY}] malformed; starting fresh.`);
        return emptyState();
      }
      const lists: List[] = [];
      for (const entry of parsed.lists) {
        if (!isPersistedList(entry)) continue;
        lists.push({
          id: entry.id,
          name: entry.name,
          createdAt: new Date(entry.createdAt),
        });
      }
      if (lists.length === 0) {
        const fallback = emptyState();
        return {
          ...fallback,
          activeListId:
            parsed.activeListId === null ? null : fallback.activeListId,
        };
      }
      const firstListId = lists[0]?.id;
      if (firstListId === undefined) return emptyState();
      const todos: Todo[] = [];
      for (const entry of parsed.todos) {
        if (!isPersistedTodo(entry)) continue;
        const listExists = lists.some((l) => l.id === entry.listId);
        const resolvedListId = listExists
          ? (entry.listId ?? firstListId)
          : firstListId;
        if (!listExists && entry.listId !== undefined) {
          console.warn(
            `[${STORAGE_KEY}] todo ${entry.id} pointed at missing list ${entry.listId}; reassigning to "${lists[0]?.name ?? DEFAULT_LIST_NAME}".`,
          );
        }
        todos.push(hydrateTodo(entry, resolvedListId));
      }
      const activeListId =
        parsed.activeListId !== null &&
        lists.some((l) => l.id === parsed.activeListId)
          ? parsed.activeListId
          : parsed.activeListId === null
            ? null
            : firstListId;
      return { lists, todos, activeListId };
    }

    const migrated = migrateV1();
    if (migrated !== null) return migrated;

    return emptyState();
  } catch (err) {
    console.warn(`[${STORAGE_KEY}] failed to read from localStorage:`, err);
    return emptyState();
  }
}

export function writeToStorage(state: LoadedState): void {
  try {
    const payload: PersistedState = {
      lists: state.lists.map((l) => ({
        id: l.id,
        name: l.name,
        createdAt: l.createdAt.toISOString(),
      })),
      todos: state.todos.map((t) => ({
        id: t.id,
        listId: t.listId,
        description: t.description,
        completed: t.completed,
        createdAt: t.createdAt.toISOString(),
        ...(t.notes !== undefined ? { notes: t.notes } : {}),
        flagged: t.flagged,
      })),
      activeListId: state.activeListId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn(`[${STORAGE_KEY}] failed to write to localStorage:`, err);
  }
}
