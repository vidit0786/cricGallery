import type { GenerationFeedback, GenerationScores } from "@/types/creative-director";
import type { ImageQualityScore } from "@/types/ai";
import { ImprovementEngine } from "@/services/improvement-engine/improvement-engine";

export class FeedbackEngine {
  constructor(private readonly improvementEngine = new ImprovementEngine()) {}

  createFeedback(scores: GenerationScores, qualityPrediction: ImageQualityScore): GenerationFeedback {
    const strengths = [
      scores.identityPreservation >= 90 ? "Strong identity preservation and facial consistency." : null,
      scores.cricketAccuracy >= 90 ? "Accurate cricket equipment and action details." : null,
      scores.lighting >= 90 ? "Professional lighting and natural shadows." : null,
      scores.composition >= 90 ? "Strong composition and camera framing." : null,
      scores.sportsPhotographyStyle >= 90 ? "Excellent sports photography style." : null,
    ].filter(Boolean) as string[];

    const weaknesses = [
      scores.facialQuality < 90 ? "Face detail could be sharper or closer to the source identity." : null,
      scores.backgroundQuality < 90 ? "Background or stadium realism could be improved." : null,
      scores.cricketAccuracy < 90 ? "Cricket pose or equipment accuracy may need refinement." : null,
      scores.lighting < 90 ? "Lighting could be more natural or dramatic." : null,
    ].filter(Boolean) as string[];

    const suggestions = this.improvementEngine.suggest(scores);
    const estimatedImprovementPotential = Math.min(30, suggestions.reduce((sum, suggestion) => sum + suggestion.expectedGain, 0));

    return {
      strengths: strengths.length ? strengths : ["Balanced professional cricket concept with usable overall realism."],
      weaknesses: weaknesses.length ? weaknesses : ["Only minor refinements are recommended."],
      suggestions,
      estimatedImprovementPotential,
      qualityPrediction,
    };
  }
}
