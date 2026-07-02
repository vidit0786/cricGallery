"use client";

import Image from "next/image";
import { RotateCcw, RotateCw, Scan, Search, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  src: string;
  alt: string;
  zoom: number;
  rotation: number;
  cropMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onToggleCrop: () => void;
}

/** Interactive local image preview with zoom, crop guide, and rotation controls. */
export function PreviewPanel({
  src,
  alt,
  zoom,
  rotation,
  cropMode,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onToggleCrop,
}: PreviewPanelProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.04] p-3">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
          <Search className="size-4" aria-hidden="true" /> Preview
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onZoomOut} aria-label="Zoom out">
            <ZoomOut aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onZoomIn} aria-label="Zoom in">
            <ZoomIn aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onRotateLeft} aria-label="Rotate left">
            <RotateCcw aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onRotateRight} aria-label="Rotate right">
            <RotateCw aria-hidden="true" />
          </Button>
          <Button type="button" variant={cropMode ? "secondary" : "outline"} size="sm" onClick={onToggleCrop} aria-label="Toggle crop preview">
            <Scan aria-hidden="true" /> Crop
          </Button>
        </div>
      </div>

      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(183,249,90,0.08),transparent_42%)]">
        <Image
          src={src}
          alt={alt}
          width={900}
          height={675}
          className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
          unoptimized
          priority
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-[12%] rounded-3xl border-2 border-dashed border-primary/70 opacity-0 transition-opacity duration-200",
            cropMode && "opacity-100",
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
