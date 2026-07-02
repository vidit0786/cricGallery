import type { CricketSelections } from "@/lib/cricket-options";
import type { GeneratedImage, ImageAnalysis, ImageQualityScore, ImageVariationMode } from "@/types/ai";

export type CreativeStrategyName =
  | "Sports Broadcast"
  | "Sports Documentary"
  | "ESPN Style"
  | "ICC Promotional"
  | "IPL Promotional"
  | "Movie Poster"
  | "Sports Magazine"
  | "Player Portrait"
  | "Victory Celebration"
  | "Training Session"
  | "Locker Room"
  | "Press Conference"
  | "Stadium Entrance"
  | "Net Practice";

export interface CreativeStrategy {
  id: string;
  name: CreativeStrategyName;
  promptInstruction: string;
  reason: string;
  idealFor: string[];
}

export interface GenerationScores {
  identityPreservation: number;
  cricketAccuracy: number;
  lighting: number;
  composition: number;
  facialQuality: number;
  backgroundQuality: number;
  overallRealism: number;
  sportsPhotographyStyle: number;
  overall: number;
}

export interface GenerationFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: ImprovementSuggestion[];
  estimatedImprovementPotential: number;
  qualityPrediction: ImageQualityScore;
}

export interface ImprovementSuggestion {
  id: string;
  label: string;
  description: string;
  variationMode: ImageVariationMode;
  expectedGain: number;
}

export interface CreativeGenerationVersion {
  id: string;
  rank: number;
  strategy: CreativeStrategy;
  generatedImage: GeneratedImage;
  prompt: string;
  promptVersion: string;
  optimizationVersion?: string;
  providerVersion?: string;
  scores: GenerationScores;
  feedback: GenerationFeedback;
  generationTimeMs: number;
  generatedAt: string;
  savedImageId?: string;
  projectId?: string;
}

export interface BestImageRecommendation {
  versionId: string;
  rank: number;
  score: number;
  reason: string;
  strengths: string[];
  improvements: string[];
}

export interface GenerationTimelineItem {
  id: string;
  label: string;
  rank: number;
  strategyName: CreativeStrategyName;
  score: number;
  generatedAt: string;
  imageDataUrl: string;
}

export interface CreativeDirectorResult {
  requestedVariations: number;
  strategies: CreativeStrategy[];
  versions: CreativeGenerationVersion[];
  recommendedImage: BestImageRecommendation;
  timeline: GenerationTimelineItem[];
  insights: {
    providerUsed: string;
    promptVersion: string;
    optimizationVersion?: string;
    averageGenerationTimeMs: number;
    recommendationScore: number;
    creativeStrategySummary: string;
  };
}

export interface CreativeDirectorInput {
  analysis: ImageAnalysis;
  selections: CricketSelections;
  basePrompt: string;
  provider: string;
  promptVersion: string;
  optimizationVersion?: string;
  providerVersion?: string;
  variationCount: number;
}
