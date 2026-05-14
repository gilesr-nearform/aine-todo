import { Heading, Icon } from '@ogcio/design-system-react';

export function EmptyState() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-center">
        <Icon icon="check_circle" size="xl" ariaHidden className="text-gray-400" />
        <Heading as="h2" size="md">
          No tasks yet
        </Heading>
        <p className="text-base text-gray-600">
          Add your first task using the box below.
        </p>
      </div>
    </div>
  );
}
