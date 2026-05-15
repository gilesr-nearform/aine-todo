import { Icon, IconButton } from '@ogcio/design-system-react';

import { useT } from '../../i18n/I18nContext';

interface TodoDeleteActionProps {
  description: string;
  onDelete: () => void;
  className?: string;
}

// Pure trigger button: parent (`TodoItem`) owns the confirm-modal state and
// the dispatch, so the keyboard Delete/Backspace shortcut can route through
// the same confirmation flow as the button click.
export function TodoDeleteAction({
  description,
  onDelete,
  className,
}: TodoDeleteActionProps) {
  const t = useT();

  return (
    <IconButton
      type="button"
      variant="flat"
      size="sm"
      ariaLabel={t('todo.delete', { description })}
      onClick={onDelete}
      className={className}
    >
      <Icon icon="delete" size="sm" ariaHidden />
    </IconButton>
  );
}
