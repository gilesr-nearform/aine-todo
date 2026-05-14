import { InputText } from '@ogcio/design-system-react';
import { useId } from 'react';

import { useT } from '../../i18n/I18nContext';
import { useTodos } from '../../state/TodosContext';

export function ListControls() {
  const { state, dispatch } = useTodos();
  const t = useT();
  const searchId = useId();

  if (state.status !== 'success' || state.todos.length === 0) return null;

  const { search } = state.filters;

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
    </div>
  );
}
