import type { CricketSelections } from "@/lib/cricket-options";
import type { CreativeDirectorResult } from "@/types/creative-director";
import type { PromptPipelineResult } from "@/types/prompt-pipeline";

export interface NormalizedBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceAnalysis {
  detected: boolean;
  location: NormalizedBoundingBox | null;
  angle: string | null;
  expression: string | null;
}

export interface ImageAnalysis {
  face: FaceAnalysis;
  hairStyle: string | null;
  hairColor: string | null;
  beardOrMoustache: string | null;
  glasses: string | null;
  skinTone: string | null;
  genderPresentation: string | null;
  estimatedAgeRange: string | null;
  clothingDescription: string | null;
  background: string | null;
  lighting: string | null;
  cameraAngle: string | null;
  pose: string | null;
  bodyOrientation: string | null;
  headDirection?: string | null;
  standingPose?: boolean | null;
  sittingPose?: boolean | null;
  walkingPose?: boolean | null;
  runningPose?: boolean | null;
  armPosition?: string | null;
  cameraDistance?: string | null;
  backgroundType?: string | null;
  environmentType?: "indoor" | "outdoor" | "uncertain" | null;
  portraitVsFullBody?: "portrait" | "half_body" | "full_body" | "uncertain" | null;
  emptySpaceAroundSubject?: "none" | "low" | "medium" | "high" | null;
  imageQuality: string | null;
  notes: string[];
}

export interface UploadedImageInput {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
}

export interface ImageAnalysisService {
  analyzeImage(image: UploadedImageInput): Promise<ImageAnalysis>;
}

export interface GenerateImageInput {
  prompt: string;
  sourceImage: UploadedImageInput;
}

export interface GeneratedImage {
  dataUrl: string;
  mimeType: string;
  provider: string;
  model: string;
}

export interface ImageGenerator {
  generateImage(input: GenerateImageInput): Promise<GeneratedImage>;
}

export type ImageVariationMode =
  | "generate_again"
  | "generate_4_variations"
  | "generate_8_variations"
  | "more_like_this"
  | "more_cinematic"
  | "more_realistic"
  | "more_dramatic"
  | "different_camera_angle"
  | "different_lighting"
  | "different_celebration"
  | "different_stadium"
  | "different_jersey"
  | "improve_face"
  | "improve_lighting"
  | "improve_pose"
  | "improve_realism"
  | "improve_stadium";

export interface CricketGenerationRequest {
  selections: CricketSelections;
  variation?: boolean;
  variationMode?: ImageVariationMode;
}

export interface ImageQualityScore {
  identityPreservation: number;
  realism: number;
  lighting: number;
  composition: number;
  cricketAccuracy: number;
  photographicQuality: number;
  promptCompleteness?: number;
  overallConfidence?: number;
  overall: number;
  summary: string;
  recommendations: string[];
}

export interface CricketGenerationResult {
  analysis: ImageAnalysis;
  prompt: string;
  promptVersion: string;
  generatedImage: GeneratedImage;
  qualityScore: ImageQualityScore;
  generationTimeMs?: number;
  generatedAt?: string;
  savedImageId?: string;
  projectId?: string;
  promptDetails?: PromptPipelineResult;
  predictedQuality?: ImageQualityScore;
  creativeDirector?: CreativeDirectorResult;
}
