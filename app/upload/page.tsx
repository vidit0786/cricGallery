import type { Metadata } from "next";
import { Camera, FileImage, Info, WandSparkles } from "lucide-react";

import { CricketCustomizationWizard } from "@/components/upload/cricket-customization-wizard";
import { requirePageUser } from "@/server/auth/page-guard";

export const metadata: Metadata = {
  title: "Professional Cricket AI Studio",
  description:
    "Upload a photo, customize professional cricket details, apply prompt presets, camera, lighting, export, and quality controls, then generate a sports-style cricket image.",
};

export default async function UploadPage() {
  await requirePageUser();

  return (
    <section className="w-full px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-3xl border border-primary/25 bg-primary/[0.12] text-primary">
          <FileImage className="size-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          Professional Cricket AI Studio
        </h1>
        <p className="mt-4 text-base leading-8 text-muted-foreground">
          Use guided professional controls for cricket format, team, role, shot/action, jersey, stadium
          atmosphere, camera, lighting, aspect ratio, export target, and prompt presets.
        </p>
      </div>

      <div className="mt-10">
        <CricketCustomizationWizard />
      </div>

      <aside className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-muted-foreground">
        <p className="flex gap-3">
          <Info className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Phase 6 expands professional cricket customization while keeping the experience guided and mobile-friendly.
          </span>
        </p>
        <p className="mt-4 flex gap-3">
          <Camera className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Camera, lighting, optimization, export, retry, and queue modules keep AI logic modular and provider-ready.
          </span>
        </p>
        <p className="mt-4 flex gap-3">
          <WandSparkles className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Payments, credits, subscriptions, referrals, analytics, and admin features are intentionally not included.
          </span>
        </p>
      </aside>
    </section>
  );
}
