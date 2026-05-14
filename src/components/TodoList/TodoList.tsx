import { useTodos } from '../../state/TodosContext';
import { TodoItem } from '../TodoItem/TodoItem';

export function TodoList() {
  const { state } = useTodos();

  if (state.todos.length === 0) return null;

  return (
    <ul className="mx-auto w-full max-w-2xl list-none p-0">
      {state.todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
