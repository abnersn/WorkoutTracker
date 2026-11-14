// The UI is English-only, so dates and numbers are too: a pt-BR browser must
// not get "12 de nov." or "1.940" in the middle of English sentences.
const LOCALE = "en";

/** "Nov 13, 2026, 6:42 PM". */
export function formatDateTime(date: Date | number): string {
  return new Intl.DateTimeFormat(LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** "Nov 13, 2026". */
export function formatDate(date: Date | number): string {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "medium" }).format(date);
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
  locale: string = LOCALE,
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

/** "6:42 PM". */
export function formatClockTime(date: Date | number): string {
  return new Intl.DateTimeFormat(LOCALE, { timeStyle: "short" }).format(date);
}
