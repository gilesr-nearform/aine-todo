import type { Action, AppState, Todo } from './types';

const UNDO_WINDOW_MS = 4000;

function createTodo(description: string): Todo {
  return {
    id: crypto.randomUUID(),
    description: description.trim(),
    completed: false,
    createdAt: new Date(),
  };
}

export function todosReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INIT_LOAD_START':
    case 'INIT_LOAD_RETRY':
      return { ...state, status: 'loading' };

    case 'INIT_LOAD_SUCCESS':
      return { ...state, status: 'success', todos: action.payload };

    case 'INIT_LOAD_FAILURE':
      return { ...state, status: 'error' };

    case 'CREATE_TODO': {
      const trimmed = action.payload.description.trim();
      if (trimmed.length === 0) return state;
      return { ...state, todos: [...state.todos, createTodo(trimmed)] };
    }

    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, completed: !t.completed } : t,
        ),
      };

    case 'DELETE_TODO': {
      const index = state.todos.findIndex((t) => t.id === action.payload.id);
      if (index === -1) return state;
      const target = state.todos[index];
      if (!target) return state;
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload.id),
        recentlyDeleted: [
          ...state.recentlyDeleted,
          {
            todo: target,
            originalIndex: index,
            expiresAt: Date.now() + UNDO_WINDOW_MS,
          },
        ],
      };
    }

    case 'UNDO_DELETE': {
      const record = state.recentlyDeleted.find(
        (r) => r.todo.id === action.payload.id,
      );
      if (!record) return state;
      const insertAt = Math.min(record.originalIndex, state.todos.length);
      const nextTodos = [
        ...state.todos.slice(0, insertAt),
        record.todo,
        ...state.todos.slice(insertAt),
      ];
      return {
        ...state,
        todos: nextTodos,
        recentlyDeleted: state.recentlyDeleted.filter(
          (r) => r.todo.id !== action.payload.id,
        ),
      };
    }

    case 'EXPIRE_DELETED':
      return {
        ...state,
        recentlyDeleted: state.recentlyDeleted.filter(
          (r) => r.todo.id !== action.payload.id,
        ),
      };
  }
}
