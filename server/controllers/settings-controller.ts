import { AIProvider, DownloadSize, ThemePreference } from "@prisma/client";
import { z } from "zod";

import { getSettings, updateSettings } from "@/server/repositories/settings-repository";
import { AppError } from "@/utils/api-errors";

const settingsSchema = z.object({
  defaultAIProvider: z.nativeEnum(AIProvider).optional(),
  defaultDownloadSize: z.nativeEnum(DownloadSize).optional(),
  defaultCricketFormat: z.string().min(1).max(80).optional(),
  theme: z.nativeEnum(ThemePreference).optional(),
});

export async function handleGetSettings(userId: string) {
  return getSettings(userId);
}

export async function handleUpdateSettings(userId: string, body: unknown) {
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) throw new AppError("Invalid settings update.", 400, "INVALID_REQUEST");
  return updateSettings(userId, parsed.data);
}
