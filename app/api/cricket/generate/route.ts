import { NextResponse } from "next/server";

import { getServerConfig } from "@/config/env";
import { isSelectionComplete, type CricketSelections } from "@/lib/cricket-options";
import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertSameOrigin } from "@/server/security/request-guards";
import { getProjectById } from "@/server/repositories/project-repository";
import { saveGeneratedImage } from "@/server/repositories/generated-image-repository";
import { logger } from "@/server/observability/logger";
import { monitoring } from "@/server/observability/monitoring";
import { CreativeDirector } from "@/services/creative-director";
import { createImageAnalysisService } from "@/services/image-analysis";
import { createImageGenerator } from "@/services/image-generation";
import { buildCricketImagePromptDetails } from "@/services/prompt-engine/cricket-prompt-engine";
import { CRICKET_PROMPT_VERSION } from "@/services/prompt-engine/prompt-version";
import { scoreCricketGenerationQuality } from "@/services/quality-engine";
import type { CricketGenerationResult, ImageVariationMode } from "@/types/ai";
import { AppError, toErrorResponse } from "@/utils/api-errors";
import { withRetry } from "@/utils/retry";
import { fileToUploadedImageInput, imageToDataUrl } from "@/utils/server-image";

export const runtime = "nodejs";
export const maxDuration = 180;

function parseSelections(value: FormDataEntryValue | null): CricketSelections {
  if (typeof value !== "string") {
    throw new AppError("Missing cricket selections. Please complete the workflow.", 400, "INVALID_REQUEST");
  }

  try {
    const selections = JSON.parse(value) as CricketSelections;

    if (!isSelectionComplete(selections)) {
      throw new AppError("Please complete all cricket selections before generating.", 400, "INVALID_REQUEST");
    }

    return selections;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Cricket selections could not be read. Please review your choices.", 400, "INVALID_REQUEST");
  }
}

function parseImage(value: FormDataEntryValue | null): File {
  if (!(value instanceof File)) {
    throw new AppError("Please upload an image before generating.", 400, "INVALID_IMAGE");
  }

  return value;
}

function parseVariationMode(value: FormDataEntryValue | null): ImageVariationMode | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  return value as ImageVariationMode;
}

function parseProjectId(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new AppError("Please select a project before generating.", 400, "INVALID_REQUEST");
  }

  return value;
}

function parseVariationCount(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return 4;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 4;
  return Math.max(1, Math.min(8, Math.round(parsed)));
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, mapper: (item: T, index: number) => Promise<R>) {
  const results: R[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    assertSameOrigin(request);
    const user = await requireUser();
    rateLimitRequest(request, "ai-generate", 10, 60_000, user.id);
    const formData = await request.formData();
    const imageFile = parseImage(formData.get("image"));
    const selections = parseSelections(formData.get("selections"));
    const variationMode = parseVariationMode(formData.get("variationMode"));
    const variationCount = parseVariationCount(formData.get("variationCount"));
    const projectId = parseProjectId(formData.get("projectId"));

    const project = await getProjectById(user.id, projectId);
    if (!project) throw new AppError("Selected project was not found.", 404, "INVALID_REQUEST");

    logger.info("ai_generation_requested", { userId: user.id, projectId, variationMode: variationMode ?? "none" });

    const config = getServerConfig();
    const sourceImage = await fileToUploadedImageInput(imageFile);

    const imageAnalysisService = createImageAnalysisService(config);
    const imageGenerator = createImageGenerator(config);

    const analysis = await withRetry(() => imageAnalysisService.analyzeImage(sourceImage), { retries: 1, delayMs: 800 });
    const promptDetails = buildCricketImagePromptDetails({ analysis, selections, variationMode });
    const baseQualityScore = promptDetails.qualityPrediction ?? scoreCricketGenerationQuality({ analysis, selections, prompt: promptDetails.finalPrompt });
    const creativeDirector = new CreativeDirector();
    const strategies = creativeDirector.plan({ analysis, selections, variationCount });

    const versions = await mapWithConcurrency(strategies, Math.min(4, variationCount), async (strategy, index) => {
      const prompt = creativeDirector.strategyPrompt(promptDetails.finalPrompt, strategy, index);
      const generationStartedAt = Date.now();
      const generatedImage = await withRetry(() => imageGenerator.generateImage({ prompt, sourceImage }), { retries: 2, delayMs: 1200 });
      const version = creativeDirector.createVersion({
        id: `generation-${index + 1}-${Date.now()}`,
        rank: index + 1,
        strategy,
        generatedImage,
        prompt,
        promptVersion: promptDetails.metadata.promptVersion ?? CRICKET_PROMPT_VERSION,
        optimizationVersion: promptDetails.metadata.optimizationVersion,
        providerVersion: promptDetails.metadata.providerVersion,
        generationTimeMs: Date.now() - generationStartedAt,
        generatedAt: new Date().toISOString(),
        analysis,
        qualityScore: baseQualityScore,
      });

      const versionResult: CricketGenerationResult = {
        analysis,
        prompt,
        promptVersion: version.promptVersion,
        generatedImage,
        qualityScore: version.feedback.qualityPrediction,
        promptDetails,
        predictedQuality: promptDetails.qualityPrediction,
        generationTimeMs: version.generationTimeMs,
        generatedAt: version.generatedAt,
      };

      const saved = await saveGeneratedImage({
        userId: user.id,
        projectId,
        name: `${strategy.name} ${selections.team} ${new Date().toLocaleDateString("en-IN")}`,
        originalImageDataUrl: imageToDataUrl(sourceImage),
        result: versionResult,
        selections,
      });

      version.savedImageId = saved.id;
      version.projectId = projectId;
      return version;
    });

    const creativeDirectorResult = creativeDirector.finalize({
      versions,
      providerUsed: versions[0]?.generatedImage.provider ?? "unknown",
      promptVersion: promptDetails.metadata.promptVersion,
      optimizationVersion: promptDetails.metadata.optimizationVersion,
      requestedVariations: variationCount,
      strategies,
    });
    const bestVersion = creativeDirectorResult.versions[0];

    const result: CricketGenerationResult = {
      analysis,
      prompt: bestVersion.prompt,
      promptVersion: bestVersion.promptVersion,
      generatedImage: bestVersion.generatedImage,
      qualityScore: bestVersion.feedback.qualityPrediction,
      promptDetails,
      predictedQuality: promptDetails.qualityPrediction,
      generationTimeMs: Date.now() - startedAt,
      generatedAt: new Date().toISOString(),
      savedImageId: bestVersion.savedImageId,
      projectId,
      creativeDirector: creativeDirectorResult,
    };

    monitoring.captureMetric("ai_generation_duration_ms", result.generationTimeMs ?? 0, { provider: bestVersion.generatedImage.provider });
    logger.info("ai_generation_completed", {
      userId: user.id,
      projectId,
      savedImageId: bestVersion.savedImageId,
      durationMs: result.generationTimeMs,
      provider: bestVersion.generatedImage.provider,
      variationCount,
      recommendedVersionId: creativeDirectorResult.recommendedImage.versionId,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("ai_generation_failed", error);
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
