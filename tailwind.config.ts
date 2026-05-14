import type { Config } from 'tailwindcss';
import { createTheme } from '@ogcio/design-system-tailwind';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="govie-dark"]'],
  theme: createTheme(),
} satisfies Config;
