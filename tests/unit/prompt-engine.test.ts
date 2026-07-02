import { describe, expect, it } from "vitest";

import { buildCricketImagePrompt } from "@/services/prompt-engine/cricket-prompt-engine";
import type { ImageAnalysis } from "@/types/ai";

const analysis: ImageAnalysis = {
  face: { detected: true, location: { x: 0.3, y: 0.2, width: 0.4, height: 0.45 }, angle: "front-facing", expression: "confident smile" },
  hairStyle: "short textured hair",
  hairColor: "black",
  beardOrMoustache: "trimmed beard",
  glasses: null,
  skinTone: "medium brown",
  genderPresentation: null,
  estimatedAgeRange: "20s",
  clothingDescription: "casual t-shirt",
  background: "plain indoor wall",
  lighting: "soft window light",
  cameraAngle: "eye level",
  pose: "standing",
  bodyOrientation: "facing camera",
  imageQuality: "clear",
  notes: [],
};

const selections = {
  format: "IPL",
  team: "RCB",
  role: "Batsman",
  pose: "Cover Drive",
  battingShot: "Cover Drive",
  stadium: "M Chinnaswamy Stadium",
  matchTime: "Night Match",
  cameraStyle: "Broadcast Camera",
  lightingStyle: "Floodlights",
  qualityLevel: "Ultra",
  aspectRatio: "16:9",
} as const;

describe("buildCricketImagePrompt", () => {
  it("merges image analysis, cricket selections, provider optimization, and negative prompts", () => {
    const prompt = buildCricketImagePrompt({ analysis, selections });

    expect(prompt).toContain("Prompt Version");
    expect(prompt).toContain("IDENTITY PRESERVATION");
    expect(prompt).toContain("RCB");
    expect(prompt).toContain("Cover Drive");
    expect(prompt).toContain("M Chinnaswamy Stadium");
    expect(prompt).toContain("Provider optimization: OpenAI");
    expect(prompt).toContain("NEGATIVE PROMPT");
    expect(prompt).toContain("extra fingers");
  });
});
