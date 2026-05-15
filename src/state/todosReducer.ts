import type { Action, AppState, List, ListId, Todo } from './types';

function newTodo(description: string, listId: ListId): Todo {
  return {
    id: crypto.randomUUID(),
    listId,
    description: description.trim(),
    completed: false,
    createdAt: new Date(),
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
        activeSmartView: action.payload.activeSmartView,
        filters: {
          ...state.filters,
          showCompleted: action.payload.showCompleted,
        },
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

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload.id),
        // Also clear editing state if we just deleted the row being edited.
        editingId:
          state.editingId === action.payload.id ? null : state.editingId,
      };

    case 'REORDER_TODO': {
      const index = state.todos.findIndex((t) => t.id === action.payload.id);
      if (index === -1) return state;
      const current = state.todos[index];
      if (!current) return state;
      const step = action.payload.direction === 'up' ? -1 : 1;
      // When completed items are hidden (Epic 11 default), the user sees an
      // intermixed list with the completed rows omitted. A reorder press
      // should swap with the next *visible* same-list neighbour — otherwise
      // tapping the up arrow would silently swap with a hidden completed
      // item and produce no visual change. Skip both other-list rows and
      // hidden-completed rows.
      const skipHiddenCompleted = !state.filters.showCompleted;
      let swapWith = index + step;
      while (swapWith >= 0 && swapWith < state.todos.length) {
        const candidate = state.todos[swapWith];
        if (
          candidate &&
          candidate.listId === current.listId &&
          !(skipHiddenCompleted && candidate.completed)
        ) {
          break;
        }
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

    case 'SET_SEARCH':
      return {
        ...state,
        filters: { ...state.filters, search: action.payload.value },
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
        activeSmartView: 'all',
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
        activeSmartView: nextActive === null ? 'all' : state.activeSmartView,
      };
    }

    case 'SET_ACTIVE_LIST':
      return {
        ...state,
        activeListId: action.payload.id,
        activeSmartView: action.payload.id === null ? 'all' : state.activeSmartView,
      };

    case 'SET_SMART_VIEW':
      return {
        ...state,
        activeListId: null,
        activeSmartView: action.payload.view,
      };

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
