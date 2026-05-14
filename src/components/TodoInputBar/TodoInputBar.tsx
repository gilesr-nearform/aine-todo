import { Button, InputText } from '@ogcio/design-system-react';

export function TodoInputBar() {
  return (
    <form
      className="flex w-full items-end gap-3"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Add a task"
    >
      <div className="flex-1">
        <InputText
          id="todo-input"
          name="todo-input"
          type="text"
          placeholder="Add a task"
          aria-label="Task description"
          disabled
        />
      </div>
      <Button type="submit" variant="primary" disabled>
        Add
      </Button>
    </form>
  );
}
