import { Prisma } from "@prisma/client";

import { prisma } from "@/server/database/prisma";
import type { CricketGenerationResult } from "@/types/ai";
import type { CricketSelections } from "@/lib/cricket-options";

export interface ImageFilters {
  team?: string;
  role?: string;
  stadium?: string;
  promptVersion?: string;
  favorite?: boolean;
  projectId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function listGeneratedImages(userId: string, filters: ImageFilters = {}) {
  const selectionFilters: Prisma.GeneratedImageWhereInput[] = [];
  if (filters.team) selectionFilters.push({ cricketSelections: { path: ["team"], equals: filters.team } });
  if (filters.role) selectionFilters.push({ cricketSelections: { path: ["role"], equals: filters.role } });
  if (filters.stadium) selectionFilters.push({ cricketSelections: { path: ["stadium"], equals: filters.stadium } });

  return prisma.generatedImage.findMany({
    where: {
      userId,
      projectId: filters.projectId,
      promptVersion: filters.promptVersion,
      isFavorite: filters.favorite,
      createdAt:
        filters.dateFrom || filters.dateTo
          ? {
              gte: filters.dateFrom,
              lte: filters.dateTo,
            }
          : undefined,
      AND: selectionFilters,
    },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGeneratedImageById(userId: string, imageId: string) {
  return prisma.generatedImage.findFirst({
    where: { id: imageId, userId },
    include: { project: true },
  });
}

export async function saveGeneratedImage({
  userId,
  projectId,
  name,
  originalImageDataUrl,
  result,
  selections,
}: {
  userId: string;
  projectId: string;
  name: string;
  originalImageDataUrl: string;
  result: CricketGenerationResult;
  selections: CricketSelections;
}) {
  const promptVersionRecord = await prisma.promptVersion.upsert({
    where: { version: result.promptVersion },
    update: {},
    create: {
      version: result.promptVersion,
      description: "Cricket AI Studio quality prompt engine version.",
    },
  });

  return prisma.generatedImage.create({
    data: {
      userId,
      projectId,
      promptVersionId: promptVersionRecord.id,
      name,
      originalImageDataUrl,
      generatedImageDataUrl: result.generatedImage.dataUrl,
      prompt: result.prompt,
      promptVersion: result.promptVersion,
      promptMetadata: result.promptDetails?.metadata as unknown as Prisma.InputJsonValue,
      cricketSelections: selections as Prisma.InputJsonValue,
      imageProvider: result.generatedImage.provider,
      imageModel: result.generatedImage.model,
      mimeType: result.generatedImage.mimeType,
      qualityScore: result.qualityScore as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function updateGeneratedImage(
  userId: string,
  imageId: string,
  data: { name?: string; isFavorite?: boolean; projectId?: string },
) {
  return prisma.generatedImage.update({ where: { id: imageId, userId }, data });
}

export async function deleteGeneratedImage(userId: string, imageId: string) {
  return prisma.generatedImage.delete({ where: { id: imageId, userId } });
}

export async function duplicateGeneratedImage(userId: string, imageId: string) {
  const image = await prisma.generatedImage.findFirstOrThrow({ where: { id: imageId, userId } });

  return prisma.generatedImage.create({
    data: {
      userId,
      projectId: image.projectId,
      promptVersionId: image.promptVersionId,
      name: `${image.name} Copy`,
      originalImageDataUrl: image.originalImageDataUrl,
      generatedImageDataUrl: image.generatedImageDataUrl,
      prompt: image.prompt,
      promptVersion: image.promptVersion,
      promptMetadata: image.promptMetadata as Prisma.InputJsonValue,
      cricketSelections: image.cricketSelections as Prisma.InputJsonValue,
      imageProvider: image.imageProvider,
      imageModel: image.imageModel,
      mimeType: image.mimeType,
      qualityScore: image.qualityScore as Prisma.InputJsonValue,
      isFavorite: image.isFavorite,
    },
  });
}

export async function getGenerationCount(userId: string) {
  return prisma.generatedImage.count({ where: { userId } });
}

export async function getRecentImages(userId: string, take = 8) {
  return prisma.generatedImage.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}
