import type { Config } from 'tailwindcss';
import { createTheme } from '@ogcio/design-system-tailwind';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: createTheme(),
} satisfies Config;
