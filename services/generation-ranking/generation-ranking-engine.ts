import type { CreativeGenerationVersion, GenerationScores } from "@/types/creative-director";
import type { ImageAnalysis, ImageQualityScore } from "@/types/ai";

function clamp(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function average(values: number[]) {
  return clamp(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export class GenerationRankingEngine {
  score({
    analysis,
    prompt,
    qualityScore,
    strategyName,
  }: {
    analysis: ImageAnalysis;
    prompt: string;
    qualityScore: ImageQualityScore;
    strategyName: string;
  }): GenerationScores {
    const promptLower = prompt.toLowerCase();
    const identityPreservation = clamp(qualityScore.identityPreservation + (analysis.face.detected ? 5 : -8));
    const cricketAccuracy = clamp(qualityScore.cricketAccuracy + (promptLower.includes("correct cricket") ? 5 : 0));
    const lighting = clamp(qualityScore.lighting + (promptLower.includes("natural shadows") ? 4 : 0));
    const composition = clamp(qualityScore.composition + (promptLower.includes("composition") ? 4 : 0));
    const facialQuality = clamp(identityPreservation + (promptLower.includes("sharp face") || promptLower.includes("sharp facial") ? 4 : 0));
    const backgroundQuality = clamp(qualityScore.realism + (promptLower.includes("stadium") ? 5 : 0));
    const overallRealism = clamp(qualityScore.realism + (promptLower.includes("photorealistic") ? 5 : 0));
    const sportsPhotographyStyle = clamp(qualityScore.photographicQuality + (strategyName.includes("Broadcast") ? 5 : 0));
    const overall = average([
      identityPreservation,
      cricketAccuracy,
      lighting,
      composition,
      facialQuality,
      backgroundQuality,
      overallRealism,
      sportsPhotographyStyle,
    ]);

    return {
      identityPreservation,
      cricketAccuracy,
      lighting,
      composition,
      facialQuality,
      backgroundQuality,
      overallRealism,
      sportsPhotographyStyle,
      overall,
    };
  }

  rank(versions: CreativeGenerationVersion[]) {
    return [...versions]
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .map((version, index) => ({ ...version, rank: index + 1 }));
  }
}
