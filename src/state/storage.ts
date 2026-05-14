import type { Todo } from './types';

export const STORAGE_KEY = 'listlens:v1:todos';

interface PersistedTodo {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

function isPersistedTodo(value: unknown): value is PersistedTodo {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.description === 'string' &&
    typeof record.completed === 'boolean' &&
    typeof record.createdAt === 'string'
  );
}

export function readFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null || raw === '') return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(
        `[${STORAGE_KEY}] stored value is not an array; ignoring.`,
      );
      return [];
    }
    const todos: Todo[] = [];
    for (const entry of parsed) {
      if (!isPersistedTodo(entry)) {
        console.warn(
          `[${STORAGE_KEY}] dropping malformed entry during read.`,
        );
        continue;
      }
      todos.push({
        id: entry.id,
        description: entry.description,
        completed: entry.completed,
        createdAt: new Date(entry.createdAt),
      });
    }
    return todos;
  } catch (err) {
    console.warn(`[${STORAGE_KEY}] failed to read from localStorage:`, err);
    return [];
  }
}

export function writeToStorage(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.warn(`[${STORAGE_KEY}] failed to write to localStorage:`, err);
  }
}
