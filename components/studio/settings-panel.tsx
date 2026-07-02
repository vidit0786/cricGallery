import { Aperture, Camera, Gauge, ImageIcon, Ratio, Sparkles, SunMedium } from "lucide-react";

import type { CricketSelections } from "@/lib/cricket-options";

interface SettingsPanelProps {
  selections: CricketSelections;
  isProcessing?: boolean;
}

const rows: Array<{ label: string; key: keyof CricketSelections; icon: typeof Camera }> = [
  { label: "Provider", key: "qualityLevel", icon: Sparkles },
  { label: "Camera", key: "cameraStyle", icon: Camera },
  { label: "Lighting", key: "lightingStyle", icon: SunMedium },
  { label: "Aspect Ratio", key: "aspectRatio", icon: Ratio },
  { label: "Image Size", key: "targetResolution", icon: ImageIcon },
  { label: "Quality", key: "qualityLevel", icon: Gauge },
  { label: "Export", key: "exportTarget", icon: Aperture },
];

function display(value: CricketSelections[keyof CricketSelections], fallback = "Auto") {
  if (typeof value === "boolean") return value ? "Enabled" : "Off";
  return value || fallback;
}

/** Right-side AI settings summary panel. */
export function SettingsPanel({ selections, isProcessing = false }: SettingsPanelProps) {
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-80 shrink-0 overflow-auto rounded-[2rem] border border-white/10 bg-[#07130e]/85 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl 2xl:block">
      <div className="mb-4 rounded-3xl border border-primary/20 bg-primary/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">AI Settings</p>
        <h2 className="mt-2 text-xl font-black text-foreground">Generation Controls</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Studio settings are synced from your wizard choices. Backend and AI logic remain unchanged in Phase 6.1.
        </p>
      </div>

      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={`${row.label}-${row.key}`} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <row.icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{row.label}</p>
                <p className="truncate font-black text-foreground">
                  {row.label === "Provider" ? "OpenAI" : display(selections[row.key])}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">Status</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {isProcessing ? "Rendering in progress with animated studio feedback." : "Ready for guided professional generation."}
        </p>
      </div>
    </aside>
  );
}
