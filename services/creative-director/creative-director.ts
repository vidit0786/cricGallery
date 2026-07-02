import type { CricketSelections } from "@/lib/cricket-options";
import { CreativeStrategyEngine } from "@/services/creative-strategies/creative-strategy-engine";
import { FeedbackEngine } from "@/services/feedback-engine/feedback-engine";
import { GenerationInsightsEngine } from "@/services/generation-insights/generation-insights-engine";
import { GenerationRankingEngine } from "@/services/generation-ranking/generation-ranking-engine";
import { TimelineEngine } from "@/services/timeline-engine/timeline-engine";
import type { GeneratedImage, ImageAnalysis, ImageQualityScore } from "@/types/ai";
import type { CreativeDirectorResult, CreativeGenerationVersion, CreativeStrategy } from "@/types/creative-director";

export class CreativeDirector {
  constructor(
    private readonly strategyEngine = new CreativeStrategyEngine(),
    private readonly rankingEngine = new GenerationRankingEngine(),
    private readonly feedbackEngine = new FeedbackEngine(),
    private readonly timelineEngine = new TimelineEngine(),
    private readonly insightsEngine = new GenerationInsightsEngine(),
  ) {}

  plan({ analysis, selections, variationCount }: { analysis: ImageAnalysis; selections: CricketSelections; variationCount: number }) {
    return this.strategyEngine.selectStrategies({ analysis, selections, count: variationCount });
  }

  strategyPrompt(basePrompt: string, strategy: CreativeStrategy, index: number) {
    return [
      basePrompt,
      `CREATIVE DIRECTOR VARIATION ${index + 1}: ${strategy.name}`,
      strategy.promptInstruction,
      `Why this strategy: ${strategy.reason}`,
      "This variation must preserve the same uploaded identity and cricket settings while exploring this distinct creative direction.",
    ].join("\n\n");
  }

  createVersion({
    id,
    rank,
    strategy,
    generatedImage,
    prompt,
    promptVersion,
    optimizationVersion,
    providerVersion,
    generationTimeMs,
    generatedAt,
    analysis,
    qualityScore,
  }: {
    id: string;
    rank: number;
    strategy: CreativeStrategy;
    generatedImage: GeneratedImage;
    prompt: string;
    promptVersion: string;
    optimizationVersion?: string;
    providerVersion?: string;
    generationTimeMs: number;
    generatedAt: string;
    analysis: ImageAnalysis;
    qualityScore: ImageQualityScore;
  }): CreativeGenerationVersion {
    const scores = this.rankingEngine.score({ analysis, prompt, qualityScore, strategyName: strategy.name });
    const feedback = this.feedbackEngine.createFeedback(scores, qualityScore);

    return {
      id,
      rank,
      strategy,
      generatedImage,
      prompt,
      promptVersion,
      optimizationVersion,
      providerVersion,
      scores,
      feedback,
      generationTimeMs,
      generatedAt,
    };
  }

  finalize({
    versions,
    providerUsed,
    promptVersion,
    optimizationVersion,
    requestedVariations,
    strategies,
  }: {
    versions: CreativeGenerationVersion[];
    providerUsed: string;
    promptVersion: string;
    optimizationVersion?: string;
    requestedVariations: number;
    strategies: CreativeStrategy[];
  }): CreativeDirectorResult {
    const ranked = this.rankingEngine.rank(versions);
    const best = ranked[0];
    const recommendedImage = {
      versionId: best.id,
      rank: best.rank,
      score: best.scores.overall,
      reason: `${best.strategy.name} has the strongest balance of identity preservation, cricket accuracy, lighting and professional realism.`,
      strengths: best.feedback.strengths,
      improvements: best.feedback.suggestions.slice(0, 3).map((suggestion) => suggestion.label),
    };

    return {
      requestedVariations,
      strategies,
      versions: ranked,
      recommendedImage,
      timeline: this.timelineEngine.build(ranked),
      insights: this.insightsEngine.summarize(ranked, providerUsed, promptVersion, optimizationVersion),
    };
  }
}
