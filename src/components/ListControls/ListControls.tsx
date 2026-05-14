import { Button, InputText } from '@ogcio/design-system-react';
import { useId } from 'react';

import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';
import { FlagIcon } from '../Icons/FlagIcon';

export function ListControls() {
  const { state, dispatch } = useTodos();
  const t = useT();
  const searchId = useId();

  if (state.status !== 'success' || state.todos.length === 0) return null;

  const { search, flaggedOnly } = state.filters;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 pb-3">
      <div className="flex flex-col gap-1">
        <label htmlFor={searchId} className="sr-only">
          {t('controls.searchLabel')}
        </label>
        <InputText
          id={searchId}
          type="search"
          value={search}
          placeholder={t('controls.searchPlaceholder')}
          onChange={(event) =>
            dispatch({
              type: 'SET_SEARCH',
              payload: { value: event.target.value },
            })
          }
          autoComplete="off"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={flaggedOnly ? 'primary' : 'secondary'}
          size="sm"
          aria-pressed={flaggedOnly}
          onClick={() =>
            dispatch({
              type: 'SET_FLAGGED_ONLY',
              payload: { value: !flaggedOnly },
            })
          }
        >
          <FlagIcon filled={flaggedOnly} />
          <span className="ml-1">{t('controls.flaggedOnly')}</span>
        </Button>
      </div>
    </div>
  );
}
