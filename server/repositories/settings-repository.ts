import type { AIProvider, DownloadSize, ThemePreference } from "@prisma/client";

import { prisma } from "@/server/database/prisma";

export async function getSettings(userId: string) {
  return prisma.generationSettings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function updateSettings(
  userId: string,
  data: {
    defaultAIProvider?: AIProvider;
    defaultDownloadSize?: DownloadSize;
    defaultCricketFormat?: string;
    theme?: ThemePreference;
  },
) {
  return prisma.generationSettings.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}
