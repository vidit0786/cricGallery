import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis, ImageQualityScore, ImageVariationMode } from "@/types/ai";
import type { CricketRecommendationResult } from "@/types/recommendation-types";

export type PromptProvider = "openai" | "gemini" | "flux" | "stable-diffusion" | "future" | string;

export interface CricketContext {
  playerRole: string;
  pose: string;
  lighting: string;
  camera: string;
  background: string;
  stadium: string;
  matchType: string;
  weather: string;
  mood: string;
  crowd: string;
  jersey: string;
  identityDetails: string[];
  composition: string;
  cricketAccuracy: string[];
  userChoices: CricketSelections;
  recommendations: CricketRecommendationResult;
  imageAnalysis: ImageAnalysis;
}

export interface PromptOptimization {
  title: string;
  before?: string;
  after: string;
  reason: string;
}

export interface PromptVersionMetadata {
  promptVersion: string;
  optimizationVersion: string;
  providerVersion: string;
  generationTimestamp: string;
}

export interface PromptPipelineInput {
  analysis: ImageAnalysis;
  selections: CricketSelections;
  provider: PromptProvider;
  variationMode?: ImageVariationMode;
}

export interface PromptPipelineResult {
  finalPrompt: string;
  originalUserChoices: CricketSelections;
  recommendations: CricketRecommendationResult;
  cricketContext: CricketContext;
  optimizations: PromptOptimization[];
  negativePrompt: string;
  providerProfile: string;
  qualityPrediction: ImageQualityScore;
  metadata: PromptVersionMetadata;
}
