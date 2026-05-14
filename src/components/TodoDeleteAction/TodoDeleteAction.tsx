import { Icon, IconButton } from '@ogcio/design-system-react';

import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import type { TodoId } from '../../state/types';

interface TodoDeleteActionProps {
  id: TodoId;
  description: string;
  className?: string;
}

export function TodoDeleteAction({
  id,
  description,
  className,
}: TodoDeleteActionProps) {
  const { dispatch } = useTodos();
  const t = useT();

  return (
    <IconButton
      type="button"
      variant="flat"
      size="sm"
      ariaLabel={t('todo.delete', { description })}
      onClick={() => dispatch({ type: 'DELETE_TODO', payload: { id } })}
      className={className}
    >
      <Icon icon="delete" size="sm" ariaHidden />
    </IconButton>
  );
}
