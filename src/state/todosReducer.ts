import type { Action, AppState, Todo } from './types';

const UNDO_WINDOW_MS = 4000;

function createTodo(description: string): Todo {
  return {
    id: crypto.randomUUID(),
    description: description.trim(),
    completed: false,
    createdAt: new Date(),
    flagged: false,
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

    case 'REORDER_TODO': {
      const index = state.todos.findIndex((t) => t.id === action.payload.id);
      if (index === -1) return state;
      const swapWith =
        action.payload.direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= state.todos.length) return state;
      const current = state.todos[index];
      const neighbour = state.todos[swapWith];
      if (!current || !neighbour) return state;
      const next = [...state.todos];
      next[index] = neighbour;
      next[swapWith] = current;
      return { ...state, todos: next };
    }

    case 'UPDATE_TODO': {
      const trimmedDescription = action.payload.description.trim();
      if (trimmedDescription.length === 0) return state;
      const trimmedNotes = action.payload.notes?.trim();
      const nextNotes =
        trimmedNotes === undefined || trimmedNotes.length === 0
          ? undefined
          : trimmedNotes;
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? { ...t, description: trimmedDescription, notes: nextNotes }
            : t,
        ),
        editingId: state.editingId === action.payload.id ? null : state.editingId,
      };
    }

    case 'TOGGLE_FLAG':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, flagged: !t.flagged } : t,
        ),
      };

    case 'SET_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload.value },
      };

    case 'SET_FLAGGED_ONLY':
      return {
        ...state,
        filters: { ...state.filters, flaggedOnly: action.payload.value },
      };

    case 'SET_SHOW_COMPLETED':
      return {
        ...state,
        filters: { ...state.filters, showCompleted: action.payload.value },
      };

    case 'START_EDIT':
      return { ...state, editingId: action.payload.id };

    case 'CANCEL_EDIT':
      return { ...state, editingId: null };
  }
}
