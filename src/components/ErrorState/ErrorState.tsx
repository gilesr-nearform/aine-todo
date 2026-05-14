import { Alert, Button } from '@ogcio/design-system-react';

import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';

export function ErrorState() {
  const { state, retry } = useTodos();
  const t = useT();
  const retryInFlight = state.status === 'loading';

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-4">
        <div role="alert">
          <Alert variant="danger" title={t('state.errorTitle')}>
            {t('state.errorBody')}
          </Alert>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={retry}
          disabled={retryInFlight}
        >
          {retryInFlight ? t('state.errorRetrying') : t('state.errorRetry')}
        </Button>
      </div>
    </div>
  );
}
