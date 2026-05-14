export type TodoId = string;

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Todo {
  id: TodoId;
  description: string;
  completed: boolean;
  createdAt: Date;
}

export interface DeletedRecord {
  todo: Todo;
  originalIndex: number;
  expiresAt: number;
}

export interface AppState {
  status: LoadStatus;
  todos: Todo[];
  recentlyDeleted: DeletedRecord[];
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
    };

export const initialState: AppState = {
  status: 'idle',
  todos: [],
  recentlyDeleted: [],
};
