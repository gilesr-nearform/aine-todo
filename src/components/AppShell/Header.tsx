import {
  HeaderLogo,
  HeaderNext,
  HeaderTitle,
} from '@ogcio/design-system-react';

export function Header() {
  return (
    <HeaderNext variant="default" aria-label="UX ToDo site header">
      <HeaderLogo>
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/15"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </span>
      </HeaderLogo>
      <HeaderTitle>UX ToDo</HeaderTitle>
    </HeaderNext>
  );
}
