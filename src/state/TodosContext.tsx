/* eslint-disable react-refresh/only-export-components --
   Story 1.2 AC requires TodosProvider and useTodos to live in this file. */
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import { loadInitialTodos } from '../mocks/initialLoad';
import { writeToStorage } from './storage';
import { todosReducer } from './todosReducer';
import { initialState, type Action, type AppState } from './types';

interface TodosContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const TodosContext = createContext<TodosContextValue | null>(null);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    let cancelled = false;
    dispatch({ type: 'INIT_LOAD_START' });
    loadInitialTodos()
      .then((todos) => {
        if (cancelled) return;
        dispatch({ type: 'INIT_LOAD_SUCCESS', payload: todos });
      })
      .catch(() => {
        if (cancelled) return;
        dispatch({ type: 'INIT_LOAD_FAILURE' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.status !== 'success') return;
    writeToStorage(state.todos);
  }, [state.status, state.todos]);

  return (
    <TodosContext.Provider value={{ state, dispatch }}>
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
