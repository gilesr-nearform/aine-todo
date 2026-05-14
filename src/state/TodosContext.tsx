/* eslint-disable react-refresh/only-export-components --
   Story 1.2 AC requires TodosProvider and useTodos to live in this file. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import { loadInitialState } from '../mocks/initialLoad';
import { writeToStorage } from './storage';
import { todosReducer } from './todosReducer';
import { initialState, type Action, type AppState } from './types';

interface TodosContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  retry: () => void;
}

const TodosContext = createContext<TodosContextValue | null>(null);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const hasLoadedRef = useRef(false);
  const inFlightRef = useRef(false);

  const runLoad = useCallback((isRetry: boolean) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    dispatch({ type: isRetry ? 'INIT_LOAD_RETRY' : 'INIT_LOAD_START' });
    loadInitialState()
      .then((loaded) => {
        dispatch({ type: 'INIT_LOAD_SUCCESS', payload: loaded });
      })
      .catch(() => {
        dispatch({ type: 'INIT_LOAD_FAILURE' });
      })
      .finally(() => {
        inFlightRef.current = false;
      });
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    runLoad(false);
  }, [runLoad]);

  useEffect(() => {
    if (state.status !== 'success') return;
    writeToStorage({
      lists: state.lists,
      todos: state.todos,
      activeListId: state.activeListId,
      activeSmartView: state.activeSmartView,
      showCompleted: state.filters.showCompleted,
    });
  }, [
    state.status,
    state.lists,
    state.todos,
    state.activeListId,
    state.activeSmartView,
    state.filters.showCompleted,
  ]);

  const retry = useCallback(() => runLoad(true), [runLoad]);

  return (
    <TodosContext.Provider value={{ state, dispatch, retry }}>
      {children}
    </TodosContext.Provider>
  );
}

export function useTodos(): TodosContextValue {
  const value = useContext(TodosContext);
  if (value === null) {
    throw new Error('useTodos must be called inside a <TodosProvider>.');
  }
  return value;
}
