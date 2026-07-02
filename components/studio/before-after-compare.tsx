"use client";

import Image from "next/image";
import { useState } from "react";

interface BeforeAfterCompareProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

/** Accessible before/after comparison with keyboard-operable range control. */
export function BeforeAfterCompare({ beforeSrc, afterSrc, beforeAlt, afterAlt }: BeforeAfterCompareProps) {
  const [value, setValue] = useState(50);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-black/40">
        <Image src={beforeSrc} alt={beforeAlt} fill sizes="520px" className="object-cover" unoptimized loading="lazy" />
        <div className="absolute inset-y-0 right-0 overflow-hidden" style={{ width: `${100 - value}%` }}>
          <div className="relative h-full" style={{ width: `${10000 / Math.max(1, 100 - value)}%`, transform: `translateX(-${value}%)` }}>
            <Image src={afterSrc} alt={afterAlt} fill sizes="520px" className="object-cover" unoptimized loading="lazy" />
          </div>
        </div>
        <div className="absolute inset-y-0 w-0.5 bg-primary shadow-[0_0_18px_rgba(183,249,90,0.9)]" style={{ left: `${value}%` }} />
        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">Original</div>
        <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Generated</div>
      </div>
      <label className="mt-4 grid gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Compare Images
        <input
          type="range"
          min="5"
          max="95"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="w-full accent-primary"
          aria-label="Compare original and generated image"
        />
      </label>
    </div>
  );
}
