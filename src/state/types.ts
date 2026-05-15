export type TodoId = string;
export type ListId = string;

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export type SmartView = 'all' | 'completed';

export interface List {
  id: ListId;
  name: string;
  createdAt: Date;
}

export interface Todo {
  id: TodoId;
  listId: ListId;
  description: string;
  completed: boolean;
  createdAt: Date;
  notes?: string;
}

export interface Filters {
  search: string;
  showCompleted: boolean;
}

export interface AppState {
  status: LoadStatus;
  lists: List[];
  todos: Todo[];
  activeListId: ListId | null;
  activeSmartView: SmartView;
  filters: Filters;
  editingId: TodoId | null;
}

export type Action =
  | { type: 'INIT_LOAD_START' }
  | {
      type: 'INIT_LOAD_SUCCESS';
      payload: {
        lists: List[];
        todos: Todo[];
        activeListId: ListId | null;
        activeSmartView: SmartView;
        showCompleted: boolean;
      };
    }
  | { type: 'INIT_LOAD_FAILURE' }
  | { type: 'INIT_LOAD_RETRY' }
  | { type: 'CREATE_TODO'; payload: { description: string } }
  | { type: 'TOGGLE_COMPLETE'; payload: { id: TodoId } }
  | { type: 'DELETE_TODO'; payload: { id: TodoId } }
  | {
      type: 'REORDER_TODO';
      payload: { id: TodoId; direction: 'up' | 'down' };
    }
  | {
      type: 'UPDATE_TODO';
      payload: { id: TodoId; description: string; notes?: string };
    }
  | { type: 'SET_SEARCH'; payload: { value: string } }
  | { type: 'SET_SHOW_COMPLETED'; payload: { value: boolean } }
  | { type: 'START_EDIT'; payload: { id: TodoId } }
  | { type: 'CANCEL_EDIT' }
  | { type: 'CREATE_LIST'; payload: { name: string } }
  | { type: 'RENAME_LIST'; payload: { id: ListId; name: string } }
  | { type: 'DELETE_LIST'; payload: { id: ListId } }
  | { type: 'SET_ACTIVE_LIST'; payload: { id: ListId | null } }
  | { type: 'SET_SMART_VIEW'; payload: { view: SmartView } }
  | { type: 'CLEAR_COMPLETED'; payload: { listId: ListId | null } };

export const defaultFilters: Filters = {
  search: '',
  showCompleted: false,
};

export const initialState: AppState = {
  status: 'idle',
  lists: [],
  todos: [],
  activeListId: null,
  activeSmartView: 'all',
  filters: defaultFilters,
  editingId: null,
};
