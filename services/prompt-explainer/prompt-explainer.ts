import type { PromptPipelineResult } from "@/types/prompt-pipeline";

export class PromptExplainer {
  explain(result: PromptPipelineResult) {
    return {
      originalUserChoices: result.originalUserChoices,
      aiRecommendations: result.recommendations,
      optimizationChanges: result.optimizations,
      finalPrompt: result.finalPrompt,
      explanation: result.optimizations.map((optimization) => `${optimization.title}: ${optimization.reason}`),
    };
  }
}
