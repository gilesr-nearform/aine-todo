import type { Todo } from '../state/types';

export function countCompleted(todos: Todo[]): number {
  let n = 0;
  for (const t of todos) if (t.completed) n += 1;
  return n;
}
