import type { PromptProvider, PromptVersionMetadata } from "@/types/prompt-pipeline";

export const PROMPT_VERSION = "2.0.0";
export const OPTIMIZATION_VERSION = "1.0.0";

const providerVersions: Record<string, string> = {
  openai: "openai-gpt-image-profile-1.0.0",
  gemini: "gemini-image-profile-1.0.0",
  flux: "flux-kontext-profile-1.0.0",
  "stable-diffusion": "stable-diffusion-profile-1.0.0",
  future: "future-provider-profile-1.0.0",
};

export class PromptVersioningService {
  create(provider: PromptProvider, timestamp = new Date()): PromptVersionMetadata {
    return {
      promptVersion: PROMPT_VERSION,
      optimizationVersion: OPTIMIZATION_VERSION,
      providerVersion: providerVersions[provider.toLowerCase()] ?? providerVersions.future,
      generationTimestamp: timestamp.toISOString(),
    };
  }

  buildHeader(metadata: PromptVersionMetadata) {
    return [
      `Prompt Version ${metadata.promptVersion}`,
      `Optimization Version ${metadata.optimizationVersion}`,
      `Provider Version ${metadata.providerVersion}`,
      `Generation Timestamp ${metadata.generationTimestamp}`,
    ].join("\n");
  }
}
