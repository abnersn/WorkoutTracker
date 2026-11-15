/**
 * Motion tokens live in theme.css. The Web Animations API cannot take `var()` in
 * its options, so components resolve them here from the document root.
 */
export const cssToken = (name: string): string =>
  typeof document === "undefined"
    ? ""
    : getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** A duration or delay token ("180ms") as milliseconds; 0 if it is not defined. */
export function msToken(name: string): number {
  return Number.parseFloat(cssToken(name)) || 0;
}

/** An easing token, falling back to plain "ease-out" if it is not defined. */
export function easingToken(name: string): string {
  return cssToken(name) || "ease-out";
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}
