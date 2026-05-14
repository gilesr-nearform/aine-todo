import { Alert, Button } from '@ogcio/design-system-react';
import { useTodos } from '../../state/TodosContext';

export function ErrorState() {
  const { state, retry } = useTodos();
  const retryInFlight = state.status === 'loading';

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-4">
        <div role="alert">
          <Alert variant="danger" title="We couldn't load your tasks">
            Please check your connection and try again.
          </Alert>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={retry}
          disabled={retryInFlight}
        >
          {retryInFlight ? 'Trying…' : 'Try again'}
        </Button>
      </div>
    </div>
  );
}
