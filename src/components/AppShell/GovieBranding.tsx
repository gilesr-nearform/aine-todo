import { Button } from '@ogcio/design-system-react';
import { LogoHarpBlack } from '@ogcio/design-system-react/logos';

import { useI18n } from '../../i18n/I18nContext';
import { LANGUAGE_NAMES } from '../../i18n/translations';

export function GovieBranding() {
  const { language, toggleLanguage, t } = useI18n();
  const target = language === 'en' ? 'ga' : 'en';
  const targetMeta = LANGUAGE_NAMES[target];

  return (
    <div
      role="region"
      aria-label={t('branding.aria')}
      className="w-full border-b border-green-200 bg-green-100"
    >
      <div className="mx-auto flex w-full items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3 text-gray-900">
          <LogoHarpBlack aria-hidden className="h-8 w-auto shrink-0" />
          <div className="flex flex-col leading-tight">
            <span lang="ga" className="text-sm font-medium">
              {t('branding.ga')}
            </span>
            <span lang="en" className="text-xs text-gray-700 sm:text-sm">
              {t('branding.en')}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="flat"
          size="sm"
          onClick={toggleLanguage}
          aria-label={targetMeta.switchTo}
          lang={target}
        >
          {targetMeta.native}
        </Button>
      </div>
    </div>
  );
}
