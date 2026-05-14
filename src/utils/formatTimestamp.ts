type Locale = string;

const timeFormatterCache = new Map<Locale, Intl.DateTimeFormat>();
const dateFormatterCache = new Map<Locale, Intl.DateTimeFormat>();

function getTimeFormatter(locale: Locale): Intl.DateTimeFormat {
  let formatter = timeFormatterCache.get(locale);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    timeFormatterCache.set(locale, formatter);
  }
  return formatter;
}

function getDateFormatter(locale: Locale): Intl.DateTimeFormat {
  let formatter = dateFormatterCache.get(locale);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    dateFormatterCache.set(locale, formatter);
  }
  return formatter;
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export interface FormattedCreatedAt {
  kind: 'time' | 'date';
  value: string;
}

export function describeCreatedAt(
  createdAt: Date,
  locale: Locale = 'en-IE',
  now: Date = new Date()
): FormattedCreatedAt {
  if (isSameLocalDay(createdAt, now)) {
    return { kind: 'time', value: getTimeFormatter(locale).format(createdAt) };
  }
  return { kind: 'date', value: getDateFormatter(locale).format(createdAt) };
}
