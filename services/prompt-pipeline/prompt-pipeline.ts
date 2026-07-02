import { CricketContextBuilder } from "@/services/context-builder/cricket-context-builder";
import { NegativePromptEngine } from "@/services/negative-prompt-engine/negative-prompt-engine";
import { ProviderOptimizer } from "@/services/provider-optimizer/provider-optimizer";
import { QualityPredictor } from "@/services/quality-predictor/quality-predictor";
import { RecommendationContextBuilder } from "@/services/recommendation-context/context-builder";
import { CricketRecommendationEngine } from "@/services/recommendation-engine/recommendation-engine";
import { buildExportInstruction } from "@/services/export-engine";
import { buildCameraInstruction } from "@/services/prompt-engine/camera-engine";
import { buildVariationInstruction } from "@/services/prompt-engine/image-variation-builder";
import { buildLightingInstruction } from "@/services/prompt-engine/lighting-engine";
import { buildPromptPresetInstruction } from "@/services/prompt-engine/prompt-presets";
import { buildTemplateBlock, selectPromptTemplate } from "@/services/prompt-engine/prompt-templates";
import { PromptVersioningService } from "@/services/prompt-versioning/prompt-versioning";
import { PromptOptimizerStage } from "./prompt-optimizer-stage";
import type { PromptPipelineInput, PromptPipelineResult } from "@/types/prompt-pipeline";

export class PromptPipeline {
  constructor(
    private readonly recommendationContextBuilder = new RecommendationContextBuilder(),
    private readonly recommendationEngine = new CricketRecommendationEngine(),
    private readonly contextBuilder = new CricketContextBuilder(),
    private readonly promptOptimizer = new PromptOptimizerStage(),
    private readonly negativePromptEngine = new NegativePromptEngine(),
    private readonly providerOptimizer = new ProviderOptimizer(),
    private readonly versioning = new PromptVersioningService(),
    private readonly qualityPredictor = new QualityPredictor(),
  ) {}

  run(input: PromptPipelineInput): PromptPipelineResult {
    // Stage 1: Image Analysis is completed upstream and passed into this pipeline.
    const recommendationContext = this.recommendationContextBuilder.build(input.analysis);

    // Stage 2: Recommendation Engine.
    const recommendationOutput = this.recommendationEngine.recommend(recommendationContext);
    const recommendations = {
      createdAt: new Date().toISOString(),
      context: recommendationContext,
      groups: recommendationOutput.groups,
      bestSettings: recommendationOutput.bestSettings,
      overallConfidence: recommendationOutput.overallConfidence,
      summary: recommendationOutput.summary,
      generationUsed: true,
    };

    // Stage 3: Context Builder.
    const cricketContext = this.contextBuilder.build({
      analysis: input.analysis,
      selections: input.selections,
      recommendations,
    });

    // Stage 4: Prompt Optimizer.
    const promptOptimization = this.promptOptimizer.optimize(cricketContext);

    // Stage 5: Negative Prompt Builder.
    const negativePrompt = this.negativePromptEngine.build(input.provider, cricketContext);

    // Stage 6: Provider Optimizer.
    const providerOptimization = this.providerOptimizer.optimize(input.provider, cricketContext);

    const metadata = this.versioning.create(input.provider);
    const template = selectPromptTemplate(input.selections.pose ?? recommendations.bestSettings.pose ?? "Cover Drive", input.selections.role ?? recommendations.bestSettings.role ?? "Batsman");
    const lightingStyle = input.selections.lightingStyle ?? recommendations.bestSettings.lightingStyle ?? "Floodlights";
    const matchTime = input.selections.matchTime ?? recommendations.bestSettings.matchTime ?? "Night Match";
    const cameraStyle = input.selections.cameraStyle ?? recommendations.bestSettings.cameraStyle ?? "Broadcast Camera";

    // Stage 7: Final Prompt.
    const promptSections = [
      this.versioning.buildHeader(metadata),
      "FINAL INTELLIGENT CRICKET PROMPT:",
      `Create a photorealistic professional cricket image of the uploaded person as ${cricketContext.playerRole}.`,
      buildPromptPresetInstruction(input.selections.promptPreset),
      "CRICKET CONTEXT:",
      `Role: ${cricketContext.playerRole}`,
      `Pose: ${cricketContext.pose}`,
      `Match Type: ${cricketContext.matchType}`,
      `Stadium: ${cricketContext.stadium}`,
      `Lighting: ${cricketContext.lighting}`,
      `Camera: ${cricketContext.camera}`,
      `Background: ${cricketContext.background}`,
      `Weather/Mood: ${cricketContext.weather}; ${cricketContext.mood}`,
      `Crowd: ${cricketContext.crowd}`,
      `Jersey: ${cricketContext.jersey}`,
      `Composition: ${cricketContext.composition}`,
      "IDENTITY PRESERVATION DETAILS TO PRESERVE:",
      cricketContext.identityDetails.join("\n"),
      buildTemplateBlock(template),
      buildCameraInstruction(cameraStyle),
      buildLightingInstruction(lightingStyle, matchTime),
      promptOptimization.block,
      providerOptimization.block,
      buildExportInstruction(input.selections.exportTarget),
      buildVariationInstruction(input.variationMode),
      negativePrompt,
    ].filter(Boolean);

    const finalPrompt = promptSections.join("\n\n");
    const optimizations = [...promptOptimization.optimizations, ...providerOptimization.optimizations];
    const qualityPrediction = this.qualityPredictor.predict({ context: cricketContext, optimizations, finalPrompt });

    return {
      finalPrompt,
      originalUserChoices: input.selections,
      recommendations,
      cricketContext,
      optimizations,
      negativePrompt,
      providerProfile: providerOptimization.profile.name,
      qualityPrediction,
      metadata,
    };
  }
}

const defaultPipeline = new PromptPipeline();

export function runPromptPipeline(input: PromptPipelineInput) {
  return defaultPipeline.run(input);
}
