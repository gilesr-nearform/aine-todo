import type { Action, AppState, List, ListId, Todo } from './types';

const UNDO_WINDOW_MS = 4000;

function newTodo(description: string, listId: ListId): Todo {
  return {
    id: crypto.randomUUID(),
    listId,
    description: description.trim(),
    completed: false,
    createdAt: new Date(),
    flagged: false,
  };
}

function newList(name: string): List {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date(),
  };
}

function resolveTargetListId(state: AppState): ListId | null {
  if (state.activeListId !== null) {
    const exists = state.lists.some((l) => l.id === state.activeListId);
    if (exists) return state.activeListId;
  }
  return state.lists[0]?.id ?? null;
}

export function todosReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INIT_LOAD_START':
    case 'INIT_LOAD_RETRY':
      return { ...state, status: 'loading' };

    case 'INIT_LOAD_SUCCESS':
      return {
        ...state,
        status: 'success',
        lists: action.payload.lists,
        todos: action.payload.todos,
        activeListId: action.payload.activeListId,
      };

    case 'INIT_LOAD_FAILURE':
      return { ...state, status: 'error' };

    case 'CREATE_TODO': {
      const trimmed = action.payload.description.trim();
      if (trimmed.length === 0) return state;
      const targetListId = resolveTargetListId(state);
      if (targetListId === null) return state;
      return {
        ...state,
        todos: [...state.todos, newTodo(trimmed, targetListId)],
      };
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
      const current = state.todos[index];
      if (!current) return state;
      const step = action.payload.direction === 'up' ? -1 : 1;
      let swapWith = index + step;
      while (swapWith >= 0 && swapWith < state.todos.length) {
        const candidate = state.todos[swapWith];
        if (candidate && candidate.listId === current.listId) break;
        swapWith += step;
      }
      if (swapWith < 0 || swapWith >= state.todos.length) return state;
      const neighbour = state.todos[swapWith];
      if (!neighbour) return state;
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
        editingId:
          state.editingId === action.payload.id ? null : state.editingId,
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

    case 'CREATE_LIST': {
      const trimmed = action.payload.name.trim();
      if (trimmed.length === 0) return state;
      const list = newList(trimmed);
      return {
        ...state,
        lists: [...state.lists, list],
        activeListId: list.id,
      };
    }

    case 'RENAME_LIST': {
      const trimmed = action.payload.name.trim();
      if (trimmed.length === 0) return state;
      return {
        ...state,
        lists: state.lists.map((l) =>
          l.id === action.payload.id ? { ...l, name: trimmed } : l,
        ),
      };
    }

    case 'DELETE_LIST': {
      const remainingLists = state.lists.filter(
        (l) => l.id !== action.payload.id,
      );
      const remainingTodos = state.todos.filter(
        (t) => t.listId !== action.payload.id,
      );
      const nextActive =
        state.activeListId === action.payload.id ? null : state.activeListId;
      return {
        ...state,
        lists: remainingLists,
        todos: remainingTodos,
        activeListId: nextActive,
      };
    }

    case 'SET_ACTIVE_LIST':
      return { ...state, activeListId: action.payload.id };

    case 'CLEAR_COMPLETED': {
      const { listId } = action.payload;
      return {
        ...state,
        todos: state.todos.filter((t) => {
          if (!t.completed) return true;
          if (listId === null) return false;
          return t.listId !== listId;
        }),
      };
    }
  }
}
