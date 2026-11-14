import { useState, type FormEvent } from "react";
import { Button } from "./button";
import { cn, toneClass } from "./tone";

export interface AddItemFormProps {
  /** Button text, e.g. "Add workout". Also names the field's action. */
  label: string;
  placeholder: string;
  onSubmit: (value: string) => void;
  className?: string;
}

/** One name field and one button; clears itself after a submit. */
export function AddItemForm({
  label,
  placeholder,
  onSubmit,
  className,
}: AddItemFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const name = value.trim();
    if (!name) return;
    onSubmit(name);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(toneClass.neutral, "m-inset border-t border-tone-200 pt-inset", className)}
    >
      {/* Field and button sit on the inset, so their radius nests in the card's. */}
      <div className="flex items-center gap-2 rounded-card border border-tone-200 bg-tone-50 p-inset">
        <input
          required
          type="text"
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-h-11 min-w-0 flex-1 rounded-control border border-tone-200 bg-white px-3 text-tone-800 placeholder:text-slate-500 focus-visible:border-tone-400 focus-visible:ring-2 focus-visible:ring-tone-200 focus-visible:outline-none"
        />
        <Button type="submit" tone="neutral" className="shrink-0">
          {label}
        </Button>
      </div>
    </form>
  );
}
