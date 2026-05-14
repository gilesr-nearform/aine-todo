interface FlagIconProps {
  filled?: boolean;
  className?: string;
}

export function FlagIcon({ filled = false, className }: FlagIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      role="img"
      aria-hidden
      focusable="false"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 21V4h11l-1.5 3.5L15 11H4" />
      <line x1="4" y1="4" x2="4" y2="21" />
    </svg>
  );
}
