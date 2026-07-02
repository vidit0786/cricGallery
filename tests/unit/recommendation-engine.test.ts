import { describe, expect, it } from "vitest";

import { RecommendationContextBuilder } from "@/services/recommendation-context/context-builder";
import { CricketRecommendationEngine } from "@/services/recommendation-engine/recommendation-engine";
import type { ImageAnalysis } from "@/types/ai";

const analysis: ImageAnalysis = {
  face: { detected: true, location: null, angle: "front-facing", expression: "confident" },
  hairStyle: "short",
  hairColor: "black",
  beardOrMoustache: null,
  glasses: null,
  skinTone: "medium",
  genderPresentation: null,
  estimatedAgeRange: null,
  clothingDescription: "t-shirt",
  background: "outdoor park",
  lighting: "low warm light",
  cameraAngle: "eye level",
  pose: "standing",
  bodyOrientation: "side angled",
  headDirection: "towards camera",
  standingPose: true,
  sittingPose: false,
  walkingPose: false,
  runningPose: false,
  armPosition: "arms slightly extended",
  cameraDistance: "portrait close",
  backgroundType: "outdoor",
  environmentType: "outdoor",
  portraitVsFullBody: "half_body",
  emptySpaceAroundSubject: "medium",
  imageQuality: "clear",
  notes: [],
};

describe("CricketRecommendationEngine", () => {
  it("creates top recommendations with confidence, reasons, and best settings", () => {
    const context = new RecommendationContextBuilder().build(analysis);
    const result = new CricketRecommendationEngine().recommend(context);

    expect(result.groups).toHaveLength(7);
    expect(result.groups[0].options.length).toBeLessThanOrEqual(5);
    expect(result.bestSettings.format).toBeTruthy();
    expect(result.bestSettings.role).toBeTruthy();
    expect(result.bestSettings.pose).toBeTruthy();
    expect(result.overallConfidence).toBeGreaterThan(0);
    expect(result.groups[2].options[0].reason).toContain("recommend");
  });
});
