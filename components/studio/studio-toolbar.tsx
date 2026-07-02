import { SlidersHorizontal, Sparkles } from "lucide-react";

interface StudioToolbarProps {
  title: string;
  description: string;
  status?: string;
}

/** Sticky studio header for the central workspace. */
export function StudioToolbar({ title, description, status = "Ready" }: StudioToolbarProps) {
  return (
    <div className="sticky top-20 z-20 rounded-[2rem] border border-white/10 bg-background/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" /> AI Studio
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" /> {status}
        </div>
      </div>
    </div>
  );
}
