import type { Metadata } from "next";
import { BrainCircuit, Layers3, ShieldCheck, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the purpose and frontend-first roadmap of Cricket AI Studio.",
};

const principles = [
  {
    icon: Layers3,
    title: "Phased architecture",
    description:
      "The product is being built in deliberate stages so the frontend, AI workflows, and data layer can evolve cleanly.",
  },
  {
    icon: ShieldCheck,
    title: "No hidden backend",
    description:
      "This first phase does not send files anywhere. Upload previews happen locally in the browser.",
  },
  {
    icon: BrainCircuit,
    title: "AI-ready by design",
    description:
      "Components and routes are structured so future image generation features can be added with minimal refactoring.",
  },
];

export default function AboutPage() {
  return (
    <section className="page-section py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="grid size-14 place-items-center rounded-3xl border border-primary/25 bg-primary/[0.12] text-primary">
            <Trophy className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            About Cricket AI Studio
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Cricket AI Studio is designed to become a premium AI application where users upload a
            personal photo and transform it into realistic cricket-themed imagery. The long-term
            vision includes polished generation flows, galleries, account features, and production
            infrastructure.
          </p>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            For Phase 1, the scope is intentionally limited to a beautiful frontend foundation. This
            lets the product establish its visual language, responsive UX, reusable components, and
            file-upload experience before any AI or backend complexity is introduced.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="cricket-grid border-b border-white/10 bg-primary/[0.08] p-8">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Mission</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground">
                Make every fan feel like a cricket icon.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                The app will eventually blend user portraits with realistic cricket aesthetics such
                as stadium lighting, jerseys, action poses, and premium sports photography styles.
              </p>
            </div>

            <div className="grid gap-4 p-5 sm:p-6">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <div key={principle.title} className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/[0.12] text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{principle.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{principle.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current scope</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            Navigation, pages, reusable UI components, responsive styling, local image validation,
            and browser preview.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Not included yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            No AI generation, authentication, database, payments, storage provider, or external API
            connection is implemented.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next phase ready</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            The codebase is prepared for future upload pipelines, generation jobs, progress states,
            and gallery persistence.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
