import { Prisma } from "@prisma/client";

import { prisma } from "@/server/database/prisma";

export async function listProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
    include: { _count: { select: { generatedImages: true } } },
  });
}

export async function getProjectById(userId: string, projectId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      generatedImages: { orderBy: { createdAt: "desc" } },
      _count: { select: { generatedImages: true } },
    },
  });
}

export async function createProject(userId: string, data: { name: string; description?: string; isFavorite?: boolean }) {
  return prisma.project.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      isFavorite: data.isFavorite ?? false,
    },
  });
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: { name?: string; description?: string | null; isFavorite?: boolean },
) {
  return prisma.project.update({
    where: { id: projectId, userId },
    data,
  });
}

export async function deleteProject(userId: string, projectId: string) {
  return prisma.project.delete({ where: { id: projectId, userId } });
}

export async function duplicateProject(userId: string, projectId: string) {
  const project = await prisma.project.findFirstOrThrow({
    where: { id: projectId, userId },
    include: { generatedImages: true },
  });

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const copy = await tx.project.create({
      data: {
        userId,
        name: `${project.name} Copy`,
        description: project.description,
        isFavorite: false,
      },
    });

    if (project.generatedImages.length) {
      await tx.generatedImage.createMany({
        data: project.generatedImages.map((image) => ({
          userId,
          projectId: copy.id,
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
        })),
      });
    }

    return copy;
  });
}

export async function ensureDefaultProject(userId: string) {
  const existing = await prisma.project.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } });
  if (existing) return existing;

  return createProject(userId, {
    name: "My Cricket Studio Project",
    description: "Default project for generated cricket images.",
    isFavorite: true,
  });
}
