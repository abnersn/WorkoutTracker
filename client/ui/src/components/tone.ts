export type Tone = "neutral" | "primary" | "success" | "danger" | "highlight";

// Full class names so Tailwind can see them. The palettes live in theme.css.
export const toneClass: Record<Tone, string> = {
  neutral: "tone-neutral",
  primary: "tone-primary",
  success: "tone-success",
  danger: "tone-danger",
  highlight: "tone-highlight",
};

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tone-solid";
