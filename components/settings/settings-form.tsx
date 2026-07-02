"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CRICKET_FORMATS } from "@/lib/cricket-options";

type AIProviderValue = "OPENAI";
type DownloadSizeValue = "HD" | "FOUR_K" | "EIGHT_K" | "INSTAGRAM" | "INSTAGRAM_STORY" | "YOUTUBE_THUMBNAIL" | "WALLPAPER" | "POSTER";
type ThemePreferenceValue = "DARK" | "LIGHT";

const downloadSizes: DownloadSizeValue[] = [
  "HD",
  "FOUR_K",
  "EIGHT_K",
  "INSTAGRAM",
  "INSTAGRAM_STORY",
  "YOUTUBE_THUMBNAIL",
  "WALLPAPER",
  "POSTER",
];

interface SettingsFormProps {
  initialSettings: {
    defaultAIProvider: AIProviderValue;
    defaultDownloadSize: DownloadSizeValue;
    defaultCricketFormat: string;
    theme: ThemePreferenceValue;
  };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaved(false);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(response.ok);
  };

  return (
    <Card>
      <CardContent className="grid gap-5 p-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Default AI Provider
          <select
            value={settings.defaultAIProvider}
            onChange={(event) => setSettings((current) => ({ ...current, defaultAIProvider: event.target.value as AIProviderValue }))}
            className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground"
          >
            <option value="OPENAI" className="bg-card">OpenAI</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Default Download Size
          <select
            value={settings.defaultDownloadSize}
            onChange={(event) => setSettings((current) => ({ ...current, defaultDownloadSize: event.target.value as DownloadSizeValue }))}
            className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground"
          >
            {downloadSizes.map((size) => (
              <option key={size} value={size} className="bg-card">{size.replaceAll("_", " ")}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Default Cricket Format
          <select
            value={settings.defaultCricketFormat}
            onChange={(event) => setSettings((current) => ({ ...current, defaultCricketFormat: event.target.value }))}
            className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground"
          >
            {CRICKET_FORMATS.map((format) => (
              <option key={format} value={format} className="bg-card">{format}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-foreground">
          Theme
          <select
            value={settings.theme}
            onChange={(event) => setSettings((current) => ({ ...current, theme: event.target.value as ThemePreferenceValue }))}
            className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground"
          >
            <option value="DARK" className="bg-card">Dark</option>
            <option value="LIGHT" className="bg-card">Light</option>
          </select>
        </label>

        <div className="md:col-span-2">
          <Button type="button" onClick={save}>
            <Save aria-hidden="true" /> Save Settings
          </Button>
          {saved ? <p className="mt-3 text-sm text-primary">Settings saved.</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
