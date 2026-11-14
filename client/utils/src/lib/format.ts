/** "Nov 13, 2026, 6:42 PM" in the browser's locale. */
export function formatDateTime(date: Date | number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** "Nov 13, 2026" in the browser's locale. */
export function formatDate(date: Date | number): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date,
  );
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 days ago" for a past date. */
export function formatDistanceToNow(
  date: Date | number,
  now: Date | number = Date.now(),
  locale?: string,
): string {
  const seconds = Math.round(
    (new Date(date).getTime() - new Date(now).getTime()) / 1000,
  );
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return rtf.format(Math.round(seconds / size), unit);
    }
  }
  return rtf.format(0, "minute");
}
