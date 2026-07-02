import type { CreativeGenerationVersion } from "@/types/creative-director";

export class GenerationInsightsEngine {
  summarize(versions: CreativeGenerationVersion[], providerUsed: string, promptVersion: string, optimizationVersion?: string) {
    const averageGenerationTimeMs = versions.length
      ? Math.round(versions.reduce((sum, version) => sum + version.generationTimeMs, 0) / versions.length)
      : 0;
    const recommendationScore = versions[0]?.scores.overall ?? 0;
    const creativeStrategySummary = versions.map((version) => version.strategy.name).join(" → ");

    return {
      providerUsed,
      promptVersion,
      optimizationVersion,
      averageGenerationTimeMs,
      recommendationScore,
      creativeStrategySummary,
    };
  }
}
