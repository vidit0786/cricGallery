import type { Metadata } from "next";

import { SettingsForm } from "@/components/settings/settings-form";
import { requirePageUser } from "@/server/auth/page-guard";
import { getSettings } from "@/server/repositories/settings-repository";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await requirePageUser();
  const settings = await getSettings(user.id);

  return (
    <section className="page-section py-14 sm:py-20">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Settings</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">Generation preferences</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          Configure default AI provider, download size, cricket format, and theme preference.
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </section>
  );
}
