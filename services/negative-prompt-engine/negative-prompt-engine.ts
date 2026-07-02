import type { PromptProvider, CricketContext } from "@/types/prompt-pipeline";

const universalNegatives = [
  "face distortion",
  "extra fingers",
  "extra arms",
  "extra legs",
  "duplicate subjects",
  "plastic skin",
  "low resolution",
  "bad anatomy",
  "incorrect cricket gear",
  "blurry eyes",
  "noise",
  "watermarks",
  "logos",
  "text overlays",
  "cartoon style",
  "anime style",
];

const providerAdditions: Record<string, string[]> = {
  openai: ["identity drift", "over-smoothed face", "unrealistic jersey text"],
  gemini: ["semantic mismatch", "wrong sport equipment", "inconsistent background"],
  flux: ["overly stylized skin", "cinematic blur on face", "unreadable details"],
  "stable-diffusion": ["deformed hands", "mutated limbs", "bad hands", "worst quality", "low quality"],
  future: ["generic artifacts", "identity mismatch"],
};

export class NegativePromptEngine {
  build(provider: PromptProvider, context: CricketContext) {
    const additions = providerAdditions[provider.toLowerCase()] ?? providerAdditions.future;
    const cricketSpecific = context.playerRole === "Wicket Keeper"
      ? ["wrong wicket keeper gloves", "missing stumps", "incorrect keeper pads"]
      : ["wrong bat grip", "incorrect pads", "incorrect ball size"];

    return [
      "PROVIDER-AWARE NEGATIVE PROMPT:",
      [...universalNegatives, ...additions, ...cricketSpecific].join(", ") + ".",
      "Do not add readable fake text, corrupted sponsor logos, distorted faces, or non-cricket accessories.",
    ].join("\n");
  }
}
