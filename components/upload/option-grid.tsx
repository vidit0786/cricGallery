import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface OptionGridProps<T extends string> {
  options: readonly T[];
  value?: T;
  onChange: (value: T) => void;
  getDescription?: (value: T) => string;
  columns?: "two" | "three";
}

/** Reusable selectable card grid used by every cricket customization step. */
export function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  getDescription,
  columns = "three",
}: OptionGridProps<T>) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === "two" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {options.map((option) => {
        const isSelected = option === value;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isSelected
                ? "border-primary bg-primary/15 shadow-[0_0_34px_rgba(183,249,90,0.13)]"
                : "border-white/10 bg-white/[0.04] hover:border-primary/35 hover:bg-white/[0.07]",
            )}
          >
            <div className="absolute -right-10 -top-10 size-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-black text-foreground">{option}</p>
                {getDescription ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{getDescription(option)}</p>
                ) : null}
              </div>
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-white/15 bg-white/[0.04] text-transparent",
                )}
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
