import { useEffect, useId, useRef, type ReactNode } from "react";

export interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: ReactNode;
  actions?: ReactNode;
}

/**
 * A modal on the native <dialog>: focus is trapped and Escape closes it.
 * Mark the safe action with `data-autofocus` to take first focus.
 */
export function Dialog({
  open,
  title,
  onClose,
  children,
  actions,
}: DialogProps): React.JSX.Element {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (open && !el.open) {
      el.showModal();
      // showModal() focuses the first button, which may be the destructive one.
      // React's autoFocus doesn't render the attribute, so a button opts in
      // to first focus with data-autofocus.
      el.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(ev) => {
        ev.preventDefault();
        onClose();
      }}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) {
          onClose();
        }
      }}
      className="m-auto w-[min(26rem,calc(100vw-3rem))] rounded-dialog border border-indigo-200 bg-white p-0 text-indigo-800 shadow-xl backdrop:bg-slate-900/40"
    >
      {/* A 24px inset on every side; the action buttons sit on it at the bottom
          corner, so their control radius nests in the dialog's radius. */}
      <div className="p-dialog">
        <h2 id={titleId} className="text-lg font-semibold text-balance">
          {title}
        </h2>
        {children && (
          <div className="mt-2 text-sm text-slate-700">{children}</div>
        )}
      </div>
      {actions && (
        <div className="flex justify-end gap-2 px-dialog pb-dialog">
          {actions}
        </div>
      )}
    </dialog>
  );
}
