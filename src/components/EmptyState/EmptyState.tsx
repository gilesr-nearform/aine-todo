import { Heading, Icon } from '@ogcio/design-system-react';

import { useT } from '../../i18n/I18nContext';

export function EmptyState() {
  const t = useT();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-center">
        <Icon icon="check_circle" size="xl" ariaHidden className="text-gray-500" />
        <Heading as="h2" size="md">
          {t('state.emptyTitle')}
        </Heading>
        <p className="text-base text-gray-600">{t('state.emptyBody')}</p>
      </div>
    </div>
  );
}
