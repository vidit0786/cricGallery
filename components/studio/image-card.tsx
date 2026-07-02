import Image from "next/image";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageCardProps {
  src: string;
  name: string;
  isActive?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}

/** Compact image thumbnail used for multi-upload queues and history grids. */
export function ImageCard({ src, name, isActive = false, onSelect, onRemove }: ImageCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-black/25 transition-all duration-200",
        isActive ? "border-primary shadow-[0_0_24px_rgba(183,249,90,0.18)]" : "border-white/10 hover:border-primary/40",
      )}
    >
      <button type="button" onClick={onSelect} className="relative block aspect-square w-full" aria-label={`Select ${name}`}>
        <Image src={src} alt={name} fill sizes="120px" className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
      </button>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="truncate text-xs font-semibold text-white">{name}</p>
      </div>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
          aria-label={`Remove ${name}`}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
