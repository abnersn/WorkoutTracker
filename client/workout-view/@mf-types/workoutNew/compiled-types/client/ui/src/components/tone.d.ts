export type Tone = "neutral" | "primary" | "success" | "danger" | "highlight";
export declare const toneClass: Record<Tone, string>;
export declare function cn(...parts: (string | false | null | undefined)[]): string;
export declare const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tone-solid";
