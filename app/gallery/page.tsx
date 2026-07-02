import type { Metadata } from "next";
import { ImageOff } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Placeholder gallery for future generated cricket images.",
};

const placeholders = Array.from({ length: 6 }, (_, index) => index + 1);

export default function GalleryPage() {
  return (
    <section className="page-section py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Gallery</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Generated images will appear here
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Phase 1 includes a placeholder gallery only. Once AI generation is implemented in a later
          phase, generated cricket portraits can be displayed in this responsive grid.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((item) => (
          <Card key={item} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="cricket-grid grid aspect-[4/5] place-items-center rounded-[1.35rem] border border-dashed border-white/[0.14] bg-black/[0.18] p-6 text-center">
                <div>
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <ImageOff className="size-7" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-lg font-bold text-foreground">No generated images yet.</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    AI output cards will be connected in a future phase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
