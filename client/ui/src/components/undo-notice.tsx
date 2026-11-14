import { useEffect } from "react";
import { Button } from "./button";

export interface UndoNoticeProps {
  /** What just happened, e.g. "Removed Bench press". */
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  /** How long the offer stays, in ms. */
  timeout?: number;
}

/**
 * Removing is instant, so a slip of a sweaty thumb costs one tap to take back
 * rather than a confirmation on every remove.
 */
export function UndoNotice({
  message,
  onUndo,
  onDismiss,
  timeout = 8000,
}: UndoNoticeProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, timeout);
    return () => clearTimeout(t);
  }, [message, onDismiss, timeout]);

  return (
    <div
      role="status"
      className="tone-neutral flex items-center gap-3 border-b border-indigo-100 bg-indigo-50 py-1 pr-1 pl-4 text-base text-indigo-800"
    >
      <span className="min-w-0 flex-1 truncate">{message}</span>
      <Button variant="ghost" onClick={onUndo} className="font-semibold">
        Undo
      </Button>
    </div>
  );
}
