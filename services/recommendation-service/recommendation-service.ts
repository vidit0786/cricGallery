import { createHash } from "crypto";

import type { ServerConfig } from "@/config/env";
import { createImageAnalysisService } from "@/services/image-analysis";
import { RecommendationContextBuilder } from "@/services/recommendation-context/context-builder";
import { CricketRecommendationEngine } from "@/services/recommendation-engine/recommendation-engine";
import type { CricketRecommendationResult } from "@/types/recommendation-types";
import type { UploadedImageInput } from "@/types/ai";

const recommendationCache = new Map<string, CricketRecommendationResult>();

function imageCacheKey(image: UploadedImageInput) {
  return createHash("sha256").update(image.buffer).update(image.mimeType).digest("hex");
}

export class RecommendationService {
  constructor(
    private readonly config: ServerConfig,
    private readonly contextBuilder = new RecommendationContextBuilder(),
    private readonly engine = new CricketRecommendationEngine(),
  ) {}

  async recommend(image: UploadedImageInput): Promise<CricketRecommendationResult> {
    const cacheKey = imageCacheKey(image);
    const cached = recommendationCache.get(cacheKey);
    if (cached) return { ...cached, createdAt: new Date().toISOString() };

    const analysisService = createImageAnalysisService(this.config);
    const analysis = await analysisService.analyzeImage(image);
    const context = this.contextBuilder.build(analysis);
    const recommendation = this.engine.recommend(context);

    const result: CricketRecommendationResult = {
      createdAt: new Date().toISOString(),
      context,
      groups: recommendation.groups,
      bestSettings: recommendation.bestSettings,
      overallConfidence: recommendation.overallConfidence,
      summary: recommendation.summary,
      generationUsed: false,
    };

    recommendationCache.set(cacheKey, result);
    return result;
  }
}

export function createRecommendationService(config: ServerConfig) {
  return new RecommendationService(config);
}
