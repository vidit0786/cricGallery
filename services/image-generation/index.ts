import type { ServerConfig } from "@/config/env";
import type { ImageGenerator } from "@/types/ai";
import { OpenAIImageGenerator } from "./openai-image-generator";

export function createImageGenerator(config: ServerConfig): ImageGenerator {
  return new OpenAIImageGenerator(config.openAI);
}
