import type { AspectRatio, ExportTarget, QualityLevel, TargetResolution } from "@/lib/cricket-options";

export type PromptProvider = "openai" | "gemini" | "flux" | "stable-diffusion" | "future" | string;

const aspectRatioInstructions: Record<AspectRatio, string> = {
  "1:1": "Aspect ratio: 1:1 square composition with centered subject and clean social crop safety.",
  "3:4": "Aspect ratio: 3:4 vertical portrait composition with heroic athlete framing.",
  "4:5": "Aspect ratio: 4:5 vertical social feed crop with face and jersey in safe area.",
  "16:9": "Aspect ratio: 16:9 cinematic landscape sports broadcast frame with stadium context.",
  "9:16": "Aspect ratio: 9:16 vertical story crop with central subject, safe headroom, and full-action clarity.",
  "21:9": "Aspect ratio: 21:9 ultra-wide cinematic stadium composition with strong environmental depth.",
};

const exportInstructions: Record<ExportTarget, string> = {
  "Instagram Post": "Export target: Instagram Post — square/feed-safe visual, face and jersey readable inside crop.",
  "Instagram Story": "Export target: Instagram Story — vertical-safe composition, keep face clear of UI zones.",
  "Facebook Cover": "Export target: Facebook Cover — wide banner crop with subject and stadium balanced horizontally.",
  "YouTube Thumbnail": "Export target: YouTube Thumbnail — bold readable silhouette, high contrast, no text overlay.",
  "LinkedIn Banner": "Export target: LinkedIn Banner — professional horizontal banner with clean negative space.",
  Wallpaper: "Export target: Wallpaper — high-detail landscape composition suitable for desktop screens.",
  Poster: "Export target: Poster — vertical print-style hero composition with strong subject hierarchy.",
};

function qualityInstruction(quality?: QualityLevel) {
  if (quality === "Ultra") return "Quality: Ultra — maximum identity fidelity, skin detail, cricket realism, HDR lighting, crisp anatomy, print-grade 8K detail.";
  if (quality === "High") return "Quality: High — professional realism, sharp focus, clean anatomy, accurate cricket equipment, and high-resolution detail.";
  return "Quality: Standard — realistic, clean, balanced, and reliable output with clear identity.";
}

function resolutionInstruction(resolution?: TargetResolution) {
  if (resolution === "8K") return "Target resolution: 8K intent where provider supports it; avoid blur, noise, or low-detail textures.";
  if (resolution === "4K") return "Target resolution: 4K intent with crisp face, jersey fabric, equipment, grass, and stadium detail.";
  return "Target resolution: HD or better, optimized for clean web display and downloads.";
}

function providerInstruction(provider: PromptProvider) {
  const normalized = provider.toLowerCase();

  if (normalized === "openai") {
    return "Provider optimization: OpenAI — use direct natural-language instructions, explicit visual constraints, clear identity preservation, and concise negative instructions.";
  }
  if (normalized === "gemini") {
    return "Provider optimization: Gemini — describe scene semantics clearly, emphasize visual consistency, identity preservation, and avoid ambiguous stylistic references.";
  }
  if (normalized === "flux") {
    return "Provider optimization: Flux — use dense photographic descriptors, lens/lighting detail, material realism, and strong composition language.";
  }
  if (normalized === "stable-diffusion") {
    return "Provider optimization: Stable Diffusion — include compact positive descriptors, weighted realism cues, and strong negative artifact prevention.";
  }

  return "Provider optimization: Future Provider — provider-neutral professional image instructions with explicit identity, scene, lighting, camera, and cricket-accuracy constraints.";
}

export class PromptOptimizer {
  optimize({
    provider,
    qualityLevel,
    aspectRatio,
    targetResolution,
    exportTarget,
  }: {
    provider: PromptProvider;
    qualityLevel?: QualityLevel;
    aspectRatio?: AspectRatio;
    targetResolution?: TargetResolution;
    exportTarget?: ExportTarget;
  }) {
    return [
      "PROMPT OPTIMIZER:",
      providerInstruction(provider),
      qualityInstruction(qualityLevel),
      resolutionInstruction(targetResolution),
      aspectRatio ? aspectRatioInstructions[aspectRatio] : null,
      exportTarget ? exportInstructions[exportTarget] : null,
      "Automatically optimize for identity preservation, lighting consistency, camera angle, background realism, pose accuracy, cricket equipment correctness, and professional sports photography.",
    ]
      .filter(Boolean)
      .join("\n");
  }
}

const promptOptimizer = new PromptOptimizer();

export function buildOptimizedPromptBlock(input: Parameters<PromptOptimizer["optimize"]>[0]) {
  return promptOptimizer.optimize(input);
}
