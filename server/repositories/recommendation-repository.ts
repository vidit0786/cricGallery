import { Prisma } from "@prisma/client";

import { prisma } from "@/server/database/prisma";
import type { CricketRecommendationResult } from "@/types/recommendation-types";

export async function saveRecommendationHistory({
  userId,
  projectId,
  imageDataUrl,
  result,
}: {
  userId: string;
  projectId: string;
  imageDataUrl: string;
  result: CricketRecommendationResult;
}) {
  return prisma.recommendationHistory.create({
    data: {
      userId,
      projectId,
      imageDataUrl,
      recommendationContext: result.context as unknown as Prisma.InputJsonValue,
      recommendedSettings: result.bestSettings as Prisma.InputJsonValue,
      recommendations: result.groups as unknown as Prisma.InputJsonValue,
      confidence: result.overallConfidence,
      reason: result.summary,
      generationUsed: result.generationUsed,
    },
  });
}

export async function listRecommendationHistory(userId: string, projectId: string) {
  return prisma.recommendationHistory.findMany({
    where: { userId, projectId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
