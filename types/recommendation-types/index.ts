import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis } from "@/types/ai";

export type RecommendationCategory = "format" | "role" | "pose" | "stadium" | "camera" | "lighting" | "jersey";

export interface RecommendationContext {
  analysis: ImageAnalysis;
  faceAngle: string | null;
  headDirection: string | null;
  bodyOrientation: string | null;
  poseType: "standing" | "sitting" | "walking" | "running" | "unknown";
  armPosition: string | null;
  cameraDistance: string | null;
  backgroundType: string | null;
  environmentType: "indoor" | "outdoor" | "uncertain";
  lighting: string | null;
  imageQuality: string | null;
  portraitVsFullBody: "portrait" | "half_body" | "full_body" | "uncertain";
  emptySpaceAroundSubject: "none" | "low" | "medium" | "high";
}

export interface RecommendationOption<TValue extends string = string> {
  label: TValue;
  confidence: number;
  stars: number;
  reason: string;
}

export interface RecommendationGroup<TValue extends string = string> {
  category: RecommendationCategory;
  title: string;
  options: RecommendationOption<TValue>[];
}

export interface CricketRecommendationResult {
  id?: string;
  createdAt: string;
  context: RecommendationContext;
  groups: RecommendationGroup[];
  bestSettings: CricketSelections;
  overallConfidence: number;
  summary: string;
  generationUsed: boolean;
}
