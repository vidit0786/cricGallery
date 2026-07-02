import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis, ImageQualityScore } from "@/types/ai";

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function hasValue(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function average(values: number[]) {
  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/**
 * Internal deterministic quality scoring system.
 * It estimates expected output quality from source-image analysis, selected controls,
 * prompt structure, and cricket realism requirements before returning the generation.
 */
export function scoreCricketGenerationQuality({
  analysis,
  selections,
  prompt,
}: {
  analysis: ImageAnalysis;
  selections: CricketSelections;
  prompt: string;
}): ImageQualityScore {
  const identityInputs = [
    analysis.face.detected,
    analysis.face.angle,
    analysis.face.expression,
    analysis.hairStyle,
    analysis.hairColor,
    analysis.beardOrMoustache || analysis.glasses || analysis.skinTone,
  ].filter(hasValue).length;

  const identityPreservation = clampScore(68 + identityInputs * 4 + (prompt.includes("Face shape") ? 8 : 0));

  const realismTerms = ["natural", "realistic", "authentic", "professional", "skin texture", "body proportions"];
  const realism = clampScore(70 + realismTerms.filter((term) => prompt.toLowerCase().includes(term)).length * 4);

  const lighting = clampScore(
    68 +
      (selections.lightingStyle ? 10 : 0) +
      (hasValue(analysis.lighting) ? 8 : 0) +
      (prompt.toLowerCase().includes("shadows") ? 7 : 0) +
      (prompt.toLowerCase().includes("reflections") ? 5 : 0),
  );

  const composition = clampScore(
    70 +
      (selections.cameraStyle ? 12 : 0) +
      (hasValue(analysis.cameraAngle) ? 6 : 0) +
      (prompt.toLowerCase().includes("depth of field") ? 6 : 0),
  );

  const cricketAccuracyTerms = ["bat", "pads", "gloves", "helmet", "shoes", "field", "grass", "jersey"];
  const cricketAccuracy = clampScore(
    66 + cricketAccuracyTerms.filter((term) => prompt.toLowerCase().includes(term)).length * 4,
  );

  const photographicQualityTerms = ["broadcast", "8k", "hdr", "sharp focus", "color grading", "sports photography"];
  const photographicQuality = clampScore(
    68 + photographicQualityTerms.filter((term) => prompt.toLowerCase().includes(term)).length * 5,
  );

  const overall = average([
    identityPreservation,
    realism,
    lighting,
    composition,
    cricketAccuracy,
    photographicQuality,
  ]);

  const recommendations = [
    analysis.face.detected ? null : "Use a clearer image with a visible face for stronger identity preservation.",
    hasValue(analysis.lighting) ? null : "Use a well-lit source image for better lighting transfer.",
    selections.cameraStyle ? null : "Select a camera style to improve composition control.",
    selections.lightingStyle ? null : "Select a lighting style to improve photographic consistency.",
  ].filter(Boolean) as string[];

  return {
    identityPreservation,
    realism,
    lighting,
    composition,
    cricketAccuracy,
    photographicQuality,
    overall,
    summary:
      overall >= 90
        ? "Excellent professional sports photography readiness."
        : overall >= 80
          ? "Strong image-quality prompt with solid cricket realism controls."
          : "Good baseline quality; a clearer source photo can improve identity preservation.",
    recommendations,
  };
}
