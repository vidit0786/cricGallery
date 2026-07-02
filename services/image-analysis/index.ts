import type { ServerConfig } from "@/config/env";
import type { ImageAnalysisService } from "@/types/ai";
import { OpenAIImageAnalysisService } from "./openai-image-analysis-service";

export function createImageAnalysisService(config: ServerConfig): ImageAnalysisService {
  return new OpenAIImageAnalysisService(config.openAI);
}
