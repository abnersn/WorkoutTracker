import type { MouseEvent } from "react";

/**
 * Click handler for an `<a href>` rendered inside a federated view. When the host
 * supplies `navigate`, plain left-clicks become client-side navigations; modified
 * clicks (new tab, etc.) and hosts without a router fall back to the browser.
 */
export function linkClickHandler(
  href: string,
  navigate?: (to: string) => void,
): ((event: MouseEvent<HTMLElement>) => void) | undefined {
  if (!navigate) return undefined;
  return (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };
}
