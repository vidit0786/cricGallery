import type { ImageQualityScore } from "@/types/ai";
import type { CricketContext, PromptOptimization } from "@/types/prompt-pipeline";

function clamp(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function average(values: number[]) {
  return clamp(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export class QualityPredictor {
  predict({ context, optimizations, finalPrompt }: { context: CricketContext; optimizations: PromptOptimization[]; finalPrompt: string }): ImageQualityScore {
    const faceDetected = context.imageAnalysis.face.detected;
    const identityDetails = context.identityDetails.length;
    const recommendationConfidence = context.recommendations.overallConfidence;
    const promptLengthScore = finalPrompt.length > 1800 ? 92 : finalPrompt.length > 1200 ? 84 : 72;

    const identityPreservation = clamp((faceDetected ? 76 : 58) + identityDetails * 3 + recommendationConfidence * 0.08);
    const realism = clamp(74 + (finalPrompt.toLowerCase().includes("photorealistic") ? 8 : 0) + (finalPrompt.toLowerCase().includes("natural") ? 6 : 0));
    const lighting = clamp(72 + (context.lighting ? 10 : 0) + (finalPrompt.toLowerCase().includes("shadows") ? 6 : 0));
    const composition = clamp(70 + (context.camera ? 10 : 0) + (context.composition.includes("16:9") ? 3 : 0));
    const cricketAccuracy = clamp(72 + context.cricketAccuracy.length * 4 + (finalPrompt.toLowerCase().includes("correct cricket") ? 6 : 0));
    const photographicQuality = clamp(promptLengthScore + optimizations.length * 2);
    const promptCompleteness = clamp(70 + optimizations.length * 4 + context.identityDetails.length * 2);
    const overall = average([identityPreservation, realism, lighting, composition, cricketAccuracy, photographicQuality, promptCompleteness]);

    return {
      identityPreservation,
      realism,
      lighting,
      composition,
      cricketAccuracy,
      photographicQuality,
      promptCompleteness,
      overallConfidence: overall,
      overall,
      summary: `Predicted prompt readiness ${overall}%. Strongest factors: ${context.camera}, ${context.lighting}, ${context.playerRole}, ${context.pose}.`,
      recommendations: overall >= 88 ? [] : ["Use a clearer face image or apply AI recommendations for a higher predicted score."],
    };
  }
}
