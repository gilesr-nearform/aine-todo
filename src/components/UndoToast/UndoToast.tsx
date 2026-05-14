import { Button } from '@ogcio/design-system-react';
import type { DeletedRecord } from '../../state/types';

interface UndoToastProps {
  record: DeletedRecord;
  onUndo?: (id: string) => void;
}

export function UndoToast({ record, onUndo }: UndoToastProps) {
  return (
    <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-md border border-gray-200 bg-gray-900 px-4 py-3 text-white shadow-lg">
      <span className="min-w-0 flex-1 truncate text-sm">
        Deleted &ldquo;{record.todo.description}&rdquo;
      </span>
      <Button
        type="button"
        variant="flat"
        appearance="dark"
        size="sm"
        onClick={() => onUndo?.(record.todo.id)}
      >
        Undo
      </Button>
    </div>
  );
}
