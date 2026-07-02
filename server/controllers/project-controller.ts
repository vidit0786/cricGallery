import { z } from "zod";

import {
  createProject,
  deleteProject,
  duplicateProject,
  getProjectById,
  listProjects,
  updateProject,
} from "@/server/repositories/project-repository";
import { AppError } from "@/utils/api-errors";
import { sanitizeText } from "@/utils/sanitize";

const projectSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).optional().nullable(),
  isFavorite: z.boolean().optional(),
});

const updateProjectSchema = projectSchema.partial();

export async function handleListProjects(userId: string) {
  return listProjects(userId);
}

export async function handleCreateProject(userId: string, body: unknown) {
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) throw new AppError("Invalid project details.", 400, "INVALID_REQUEST");
  return createProject(userId, {
    name: sanitizeText(parsed.data.name, 80),
    description: parsed.data.description ? sanitizeText(parsed.data.description, 240) : undefined,
    isFavorite: parsed.data.isFavorite,
  });
}

export async function handleGetProject(userId: string, projectId: string) {
  const project = await getProjectById(userId, projectId);
  if (!project) throw new AppError("Project not found.", 404, "INVALID_REQUEST");
  return project;
}

export async function handleUpdateProject(userId: string, projectId: string, body: unknown) {
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) throw new AppError("Invalid project update.", 400, "INVALID_REQUEST");
  return updateProject(userId, projectId, {
    ...parsed.data,
    name: parsed.data.name ? sanitizeText(parsed.data.name, 80) : undefined,
    description: parsed.data.description ? sanitizeText(parsed.data.description, 240) : parsed.data.description,
  });
}

export async function handleDeleteProject(userId: string, projectId: string) {
  return deleteProject(userId, projectId);
}

export async function handleDuplicateProject(userId: string, projectId: string) {
  return duplicateProject(userId, projectId);
}
