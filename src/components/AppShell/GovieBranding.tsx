import { useI18n } from '../../i18n/I18nContext';
import { LANGUAGE_NAMES } from '../../i18n/translations';

export function GovieBranding() {
  const { language, toggleLanguage } = useI18n();
  const target = language === 'en' ? 'ga' : 'en';
  const targetMeta = LANGUAGE_NAMES[target];

  return (
    <div
      className="w-full text-sm text-white"
      style={{ backgroundColor: '#006658' }}
    >
      <div className="flex w-full items-center justify-end px-4 sm:px-6">
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label={targetMeta.switchTo}
          lang={target}
          className="cursor-pointer bg-transparent px-1.5 py-1 underline underline-offset-[3px] hover:bg-white/10 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
        >
          {targetMeta.native}
        </button>
      </div>
    </div>
  );
}
