import { NextResponse } from "next/server";

import { getServerConfig } from "@/config/env";
import { requireUser } from "@/server/auth/session";
import { getProjectById } from "@/server/repositories/project-repository";
import { saveRecommendationHistory } from "@/server/repositories/recommendation-repository";
import { logger } from "@/server/observability/logger";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertSameOrigin } from "@/server/security/request-guards";
import { createRecommendationService } from "@/services/recommendation-service/recommendation-service";
import { AppError, toErrorResponse } from "@/utils/api-errors";
import { fileToUploadedImageInput, imageToDataUrl } from "@/utils/server-image";

export const runtime = "nodejs";
export const maxDuration = 60;

function parseImage(value: FormDataEntryValue | null): File {
  if (!(value instanceof File)) {
    throw new AppError("Please upload an image before requesting recommendations.", 400, "INVALID_IMAGE");
  }

  return value;
}

function parseProjectId(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) {
    throw new AppError("Please select a project before requesting recommendations.", 400, "INVALID_REQUEST");
  }

  return value;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    rateLimitRequest(request, "ai-recommendations", 20, 60_000, user.id);

    const formData = await request.formData();
    const imageFile = parseImage(formData.get("image"));
    const projectId = parseProjectId(formData.get("projectId"));

    const project = await getProjectById(user.id, projectId);
    if (!project) throw new AppError("Selected project was not found.", 404, "INVALID_REQUEST");

    const sourceImage = await fileToUploadedImageInput(imageFile);
    const service = createRecommendationService(getServerConfig());
    const result = await service.recommend(sourceImage);
    const saved = await saveRecommendationHistory({
      userId: user.id,
      projectId,
      imageDataUrl: imageToDataUrl(sourceImage),
      result,
    });

    logger.info("ai_recommendations_completed", {
      userId: user.id,
      projectId,
      recommendationId: saved.id,
      confidence: result.overallConfidence,
    });

    return NextResponse.json({ ...result, id: saved.id });
  } catch (error) {
    logger.error("ai_recommendations_failed", error);
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
