/* eslint-disable react-refresh/only-export-components -- co-locating hook with icon helpers is intentional; both are only consumed by Header. */
import { useT } from '../../i18n/I18nContext';
import { useTheme } from '../../theme/ThemeContext';

export interface ThemeToggleState {
  isDark: boolean;
  label: string;
  toggle: () => void;
}

export function useThemeToggle(): ThemeToggleState {
  const t = useT();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? t('header.themeToLight') : t('header.themeToDark');
  return { isDark, label, toggle: toggleTheme };
}

export function ThemeIcon({ isDark }: { isDark: boolean }) {
  return isDark ? <SunIcon /> : <MoonIcon />;
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
