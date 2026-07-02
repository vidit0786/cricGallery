import type { ExportTarget } from "@/lib/cricket-options";

export interface ExportPreset {
  target: ExportTarget;
  width: number;
  height: number;
  safeArea: string;
}

export const PROFESSIONAL_EXPORT_PRESETS: Record<ExportTarget, ExportPreset> = {
  "Instagram Post": { target: "Instagram Post", width: 1080, height: 1080, safeArea: "center square social feed crop" },
  "Instagram Story": { target: "Instagram Story", width: 1080, height: 1920, safeArea: "vertical story crop with top and bottom UI-safe margins" },
  "Facebook Cover": { target: "Facebook Cover", width: 1640, height: 924, safeArea: "wide banner with subject in center-left safe zone" },
  "YouTube Thumbnail": { target: "YouTube Thumbnail", width: 1280, height: 720, safeArea: "high-impact 16:9 thumbnail-safe composition" },
  "LinkedIn Banner": { target: "LinkedIn Banner", width: 1584, height: 396, safeArea: "professional horizontal banner with clean negative space" },
  Wallpaper: { target: "Wallpaper", width: 2560, height: 1440, safeArea: "landscape wallpaper safe area" },
  Poster: { target: "Poster", width: 2400, height: 3600, safeArea: "vertical print poster safe margins" },
};

export function getExportPreset(exportTarget?: ExportTarget) {
  return exportTarget ? PROFESSIONAL_EXPORT_PRESETS[exportTarget] : null;
}

export function buildExportInstruction(exportTarget?: ExportTarget) {
  const preset = getExportPreset(exportTarget);
  if (!preset) return null;

  return `Export engine: optimize composition for ${preset.target} at ${preset.width}x${preset.height}; respect ${preset.safeArea}; avoid placing important facial or jersey details near crop edges.`;
}
