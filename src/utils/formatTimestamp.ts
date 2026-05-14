const timeFormatter = new Intl.DateTimeFormat('en-IE', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat('en-IE', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatCreatedAt(createdAt: Date, now: Date = new Date()): string {
  if (isSameLocalDay(createdAt, now)) {
    return `added at ${timeFormatter.format(createdAt)}`;
  }
  return `added on ${dateFormatter.format(createdAt)}`;
}
