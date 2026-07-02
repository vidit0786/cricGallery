import Link from "next/link";
import { ArrowRight, Camera, ImageUp, ShieldCheck, Sparkles, Trophy, WandSparkles } from "lucide-react";

import { FeatureCard } from "@/components/shared/feature-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: ImageUp,
    title: "Effortless photo uploads",
    description:
      "A large responsive upload flow is ready for high-quality user photos, including modern image formats such as HEIC and WEBP.",
  },
  {
    icon: ShieldCheck,
    title: "Frontend-first foundation",
    description:
      "The app is intentionally separated from AI, auth, databases, and APIs so the visual experience can be perfected first.",
  },
  {
    icon: WandSparkles,
    title: "Prepared for AI workflows",
    description:
      "Clean component boundaries make it simple to add image generation, progress states, and generated results in future phases.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="absolute inset-0 -z-10 cricket-grid opacity-50" aria-hidden="true" />
        <div className="page-section grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="size-4" aria-hidden="true" /> Premium cricket portraits
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
              Upload today. Transform into cricket greatness tomorrow.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Cricket AI Studio is a modern frontend for uploading portraits that will later become
              realistic cricket-themed images. Phase 1 focuses on a polished, responsive, production-ready
              user interface only.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/upload">
                  Upload your photo
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn about the studio</Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-2xl font-black text-primary">4</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Formats</dd>
              </div>
              <div>
                <dt className="text-2xl font-black text-primary">0</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">APIs used</dd>
              </div>
              <div>
                <dt className="text-2xl font-black text-primary">100%</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Frontend</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -left-8 top-8 h-48 w-48 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -right-6 bottom-8 h-56 w-56 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

            <Card className="relative overflow-hidden p-4">
              <div className="cricket-grid relative min-h-[520px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(160deg,rgba(8,44,28,0.95),rgba(4,16,11,0.96))] p-6">
                <div className="absolute left-1/2 top-0 h-full w-px bg-white/12" aria-hidden="true" />
                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25" aria-hidden="true" />
                <div className="absolute bottom-0 left-1/2 h-56 w-40 -translate-x-1/2 rounded-t-full bg-[#d8b35c]/80 blur-[1px]" aria-hidden="true" />

                <div className="relative z-10 flex h-full min-h-[472px] flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      Studio canvas
                    </div>
                    <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                      <Trophy className="size-6" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mx-auto grid size-64 place-items-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_80px_rgba(183,249,90,0.18)]">
                    <div className="grid size-44 place-items-center rounded-full border border-white/15 bg-black/25">
                      <Camera className="size-16 text-primary" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/25 p-4 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Input</p>
                      <p className="mt-2 font-bold text-foreground">User portrait</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/25 p-4 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Future output</p>
                      <p className="mt-2 font-bold text-foreground">Cricket avatar</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="page-section py-10 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Built for Phase 2</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            A clean foundation for future AI image generation
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Reusable components, App Router pages, local file validation, and responsive layouts are
            already in place so future AI functionality can be added without redesigning the app.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </>
  );
}
