import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

/** Premium animated progress meter used by the studio wizard and processing states. */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("grid gap-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <span>{label}</span>
          <span className="text-primary">{Math.round(safeValue)}%</span>
        </div>
      ) : null}
      <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)] animate-pulse" />
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_24px_rgba(183,249,90,0.35)] transition-all duration-500 ease-out"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
