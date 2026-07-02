import type { Metadata } from "next";
import { Clock3, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/shared/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Cricket AI Studio through a frontend-only form.",
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@cricketaistudio.example",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote-first product studio",
  },
  {
    icon: Clock3,
    label: "Phase",
    value: "Frontend foundation only",
  },
];

export default function ContactPage() {
  return (
    <section className="page-section py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Contact</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Share feedback or feature ideas
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Use this simple form to test the contact experience. It does not connect to a backend in
            Phase 1, so submitted data is not stored or sent anywhere.
          </p>

          <div className="mt-8 grid gap-4">
            {contactDetails.map((detail) => {
              const Icon = detail.icon;

              return (
                <Card key={detail.label}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                        {detail.label}
                      </p>
                      <p className="mt-1 font-semibold text-foreground">{detail.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
