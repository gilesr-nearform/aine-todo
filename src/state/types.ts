export type TodoId = string;

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Todo {
  id: TodoId;
  description: string;
  completed: boolean;
  createdAt: Date;
  notes?: string;
  flagged: boolean;
}

export interface DeletedRecord {
  todo: Todo;
  originalIndex: number;
  expiresAt: number;
}

export interface Filters {
  search: string;
  flaggedOnly: boolean;
  showCompleted: boolean;
}

export interface AppState {
  status: LoadStatus;
  todos: Todo[];
  recentlyDeleted: DeletedRecord[];
  filters: Filters;
  editingId: TodoId | null;
}

export type Action =
  | { type: 'INIT_LOAD_START' }
  | { type: 'INIT_LOAD_SUCCESS'; payload: Todo[] }
  | { type: 'INIT_LOAD_FAILURE' }
  | { type: 'INIT_LOAD_RETRY' }
  | { type: 'CREATE_TODO'; payload: { description: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: TodoId } }
  | { type: 'DELETE_TODO'; payload: { id: TodoId } }
  | { type: 'UNDO_DELETE'; payload: { id: TodoId } }
  | { type: 'EXPIRE_DELETED'; payload: { id: TodoId } }
  | {
      type: 'REORDER_TODO';
      payload: { id: TodoId; direction: 'up' | 'down' };
    }
  | {
      type: 'UPDATE_TODO';
      payload: { id: TodoId; description: string; notes?: string };
    }
  | { type: 'TOGGLE_FLAG'; payload: { id: TodoId } }
  | { type: 'SET_SEARCH'; payload: { value: string } }
  | { type: 'SET_FLAGGED_ONLY'; payload: { value: boolean } }
  | { type: 'SET_SHOW_COMPLETED'; payload: { value: boolean } }
  | { type: 'START_EDIT'; payload: { id: TodoId } }
  | { type: 'CANCEL_EDIT' };

export const defaultFilters: Filters = {
  search: '',
  flaggedOnly: false,
  showCompleted: true,
};

export const initialState: AppState = {
  status: 'idle',
  todos: [],
  recentlyDeleted: [],
  filters: defaultFilters,
  editingId: null,
};
