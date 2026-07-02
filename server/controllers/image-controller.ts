import { z } from "zod";

import { getProjectById } from "@/server/repositories/project-repository";
import {
  deleteGeneratedImage,
  duplicateGeneratedImage,
  getGeneratedImageById,
  listGeneratedImages,
  updateGeneratedImage,
  type ImageFilters,
} from "@/server/repositories/generated-image-repository";
import { AppError } from "@/utils/api-errors";
import { sanitizeText } from "@/utils/sanitize";

const imageUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  isFavorite: z.boolean().optional(),
  projectId: z.string().min(1).optional(),
});

export async function handleListImages(userId: string, searchParams: URLSearchParams) {
  const filters: ImageFilters = {
    team: searchParams.get("team") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    stadium: searchParams.get("stadium") ?? undefined,
    promptVersion: searchParams.get("promptVersion") ?? undefined,
    projectId: searchParams.get("projectId") ?? undefined,
    favorite: searchParams.get("favorite") === "true" ? true : undefined,
    dateFrom: searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined,
    dateTo: searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined,
  };

  return listGeneratedImages(userId, filters);
}

export async function handleGetImage(userId: string, imageId: string) {
  const image = await getGeneratedImageById(userId, imageId);
  if (!image) throw new AppError("Image not found.", 404, "INVALID_REQUEST");
  return image;
}

export async function handleUpdateImage(userId: string, imageId: string, body: unknown) {
  const parsed = imageUpdateSchema.safeParse(body);
  if (!parsed.success) throw new AppError("Invalid image update.", 400, "INVALID_REQUEST");

  if (parsed.data.projectId) {
    const targetProject = await getProjectById(userId, parsed.data.projectId);
    if (!targetProject) throw new AppError("Target project not found.", 404, "INVALID_REQUEST");
  }

  return updateGeneratedImage(userId, imageId, {
    ...parsed.data,
    name: parsed.data.name ? sanitizeText(parsed.data.name, 120) : undefined,
  });
}

export async function handleDeleteImage(userId: string, imageId: string) {
  return deleteGeneratedImage(userId, imageId);
}

export async function handleDuplicateImage(userId: string, imageId: string) {
  return duplicateGeneratedImage(userId, imageId);
}
