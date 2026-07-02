import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Reusable marketing card for the home page feature grid. */
export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card/90">
      <CardHeader>
        <div className="mb-2 grid size-12 place-items-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
