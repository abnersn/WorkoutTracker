/** "Nov 13, 2026, 6:42 PM" in the browser's locale. */
export declare function formatDateTime(date: Date | number): string;
/** "Nov 13, 2026" in the browser's locale. */
export declare function formatDate(date: Date | number): string;
/** "3 days ago" for a past date. */
export declare function formatDistanceToNow(date: Date | number, now?: Date | number, locale?: string): string;
