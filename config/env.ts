import { AppError } from "@/utils/api-errors";

export interface ServerConfig {
  openAI: {
    apiKey: string;
    visionModel: string;
    imageModel: string;
    imageSize: string;
    imageQuality: string;
    timeoutMs: number;
  };
}

/**
 * Dedicated server-side configuration layer.
 * Values are read only when an API route executes so the app can build without secrets.
 */
export function getServerConfig(): ServerConfig {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new AppError(
      "OPENAI_API_KEY is missing. Add it to .env.local before using AI generation.",
      500,
      "CONFIGURATION_ERROR",
    );
  }

  return {
    openAI: {
      apiKey,
      visionModel: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
      imageModel: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1",
      imageSize: process.env.OPENAI_IMAGE_SIZE ?? "1024x1024",
      imageQuality: process.env.OPENAI_IMAGE_QUALITY ?? "auto",
      timeoutMs: Number(process.env.AI_REQUEST_TIMEOUT_MS ?? 120_000),
    },
  };
}
