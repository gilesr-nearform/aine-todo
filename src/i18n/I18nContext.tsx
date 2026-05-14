/* eslint-disable react-refresh/only-export-components -- co-locating provider with hook is intentional: this file is the i18n public surface. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  translations,
  type Language,
  type TranslationKey,
} from './translations';

const STORAGE_KEY = 'listlens:v1:lang';

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (SUPPORTED_LANGUAGES as ReadonlyArray<string>).includes(value);
}

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(raw)) return raw;
  } catch {
    // localStorage may be blocked; fall through to default.
  }
  return DEFAULT_LANGUAGE;
}

function writeStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage may be blocked; silently ignore.
  }
}

export type TFunction = (key: TranslationKey, vars?: Record<string, string | number>) => string;

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TFunction;
  locale: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, vars: Record<string, string | number> | undefined): string {
  if (vars === undefined) return template;
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, String(value));
  }, template);
}

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  en: 'en-IE',
  ga: 'ga-IE',
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => readStoredLanguage());

  useEffect(() => {
    writeStoredLanguage(language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'ga' ? 'ga' : 'en';
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => (current === 'en' ? 'ga' : 'en'));
  }, []);

  const t = useCallback<TFunction>(
    (key, vars) => {
      const dict = translations[language];
      const fallback = translations[DEFAULT_LANGUAGE];
      const template = dict[key] ?? fallback[key] ?? key;
      return interpolate(template, vars);
    },
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      locale: LOCALE_BY_LANGUAGE[language],
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (value === null) {
    throw new Error('useI18n must be used inside an <I18nProvider>.');
  }
  return value;
}

export function useT(): TFunction {
  return useI18n().t;
}
