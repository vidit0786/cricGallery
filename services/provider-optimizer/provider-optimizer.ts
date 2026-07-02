import type { PromptProvider, CricketContext, PromptOptimization } from "@/types/prompt-pipeline";

export interface ProviderOptimizationProfile {
  provider: PromptProvider;
  name: string;
  strengths: string[];
  instruction: string;
}

const profiles: Record<string, ProviderOptimizationProfile> = {
  openai: {
    provider: "openai",
    name: "OpenAI GPT Image",
    strengths: ["natural language scene following", "identity-aware editing", "high-level composition"],
    instruction:
      "Provider optimization: OpenAI GPT Image — use direct natural language, explicit identity preservation, clear scene constraints, and concise artifact prevention.",
  },
  gemini: {
    provider: "gemini",
    name: "Google Gemini",
    strengths: ["semantic scene understanding", "multimodal context", "layout reasoning"],
    instruction:
      "Provider optimizer: Google Gemini — describe semantic relationships clearly, explain subject/background consistency, and avoid ambiguous style shorthand.",
  },
  flux: {
    provider: "flux",
    name: "Flux Kontext",
    strengths: ["photorealism", "texture detail", "cinematic composition"],
    instruction:
      "Provider optimizer: Flux Kontext — use dense photographic descriptors, material realism, lens details, and precise lighting language.",
  },
  "stable-diffusion": {
    provider: "stable-diffusion",
    name: "Stable Diffusion",
    strengths: ["negative prompt control", "style weights", "fine-grained descriptors"],
    instruction:
      "Provider optimizer: Stable Diffusion — use compact positive descriptors, strong negative prompt terms, lens tokens, and artifact-specific prevention.",
  },
  future: {
    provider: "future",
    name: "Future Provider",
    strengths: ["provider-neutral compatibility"],
    instruction:
      "Provider optimizer: Future Provider — use provider-neutral explicit instructions for identity, scene, camera, lighting, and cricket accuracy.",
  },
};

export class ProviderOptimizer {
  getProfile(provider: PromptProvider) {
    return profiles[provider.toLowerCase()] ?? profiles.future;
  }

  optimize(provider: PromptProvider, context: CricketContext): { block: string; optimizations: PromptOptimization[]; profile: ProviderOptimizationProfile } {
    const profile = this.getProfile(provider);
    const optimizations: PromptOptimization[] = [
      {
        title: "Provider Profile",
        after: profile.instruction,
        reason: `${profile.name} is optimized using its strengths: ${profile.strengths.join(", ")}.`,
      },
      {
        title: "Context Compression",
        after: `Keep focus on ${context.playerRole}, ${context.pose}, ${context.camera}, ${context.lighting}, ${context.stadium}.`,
        reason: "Provider prompts perform better when the key subject, action, camera, and lighting are stated clearly.",
      },
    ];

    return {
      profile,
      optimizations,
      block: [profile.instruction, `Provider focus: ${profile.strengths.join(", ")}.`].join("\n"),
    };
  }
}
