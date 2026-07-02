import { buildExportInstruction } from "@/services/export-engine";
import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis, ImageVariationMode } from "@/types/ai";
import { buildCameraInstruction } from "./camera-engine";
import { CricketContextBuilder } from "./cricket-context-builder";
import { buildVariationInstruction } from "./image-variation-builder";
import { buildLightingInstruction } from "./lighting-engine";
import { NegativePromptBuilder } from "./negative-prompt-builder";
import { PromptOptimizer, type PromptProvider } from "./prompt-optimizer";
import { buildPromptPresetInstruction } from "./prompt-presets";
import { PromptTemplates } from "./prompt-templates";
import { buildPromptVersionLine } from "./prompt-version";
import { AppError } from "@/utils/api-errors";

function requireSelection<T>(value: T | undefined, label: string): T {
  if (!value) throw new AppError(`Please select ${label} before generating.`, 400, "INVALID_REQUEST");
  return value;
}

function compact(lines: Array<string | null | undefined>) {
  return lines.filter(Boolean) as string[];
}

function buildPhotographyQualityBlock() {
  return [
    "PROFESSIONAL SPORTS PHOTOGRAPHY:",
    "Use natural light behavior, realistic shadows, accurate reflections, HDR exposure, sharp focus on face and eyes, detailed skin texture, and realistic stadium atmosphere.",
    "Camera angle, background, pose, and cricket action must feel like professional editorial or broadcast sports photography, not a poster illustration.",
    "Maintain authentic depth of field, professional color grading, realistic crowd depth, correct grass texture, and high-end camera exposure.",
  ].join("\n");
}

export class PromptEngine {
  constructor(
    private readonly contextBuilder = new CricketContextBuilder(),
    private readonly optimizer = new PromptOptimizer(),
    private readonly templates = new PromptTemplates(),
    private readonly negativePromptBuilder = new NegativePromptBuilder(),
  ) {}

  build({
    analysis,
    selections,
    provider = "openai",
    variationMode,
  }: {
    analysis: ImageAnalysis;
    selections: CricketSelections;
    provider?: PromptProvider;
    variationMode?: ImageVariationMode;
  }) {
    const role = requireSelection(selections.role, "a player role");
    const pose = requireSelection(selections.pose, "a cricket pose");
    const matchTime = requireSelection(selections.matchTime, "a match time");
    const cameraStyle = requireSelection(selections.cameraStyle, "a camera style");
    const lightingStyle = requireSelection(selections.lightingStyle, "a lighting style");
    const template = this.templates.select(pose, role);

    const promptLines = compact([
      buildPromptVersionLine(),
      "Create a professional photorealistic cricket image using the uploaded person as the identity source.",
      buildPromptPresetInstruction(selections.promptPreset),
      this.contextBuilder.buildIdentityContext(analysis),
      this.contextBuilder.buildCricketContext(selections),
      this.contextBuilder.buildJerseyContext(selections),
      this.templates.buildBlock(template),
      buildCameraInstruction(cameraStyle),
      buildLightingInstruction(lightingStyle, matchTime),
      buildPhotographyQualityBlock(),
      this.optimizer.optimize({
        provider,
        qualityLevel: selections.qualityLevel,
        aspectRatio: selections.aspectRatio,
        targetResolution: selections.targetResolution,
        exportTarget: selections.exportTarget,
      }),
      buildExportInstruction(selections.exportTarget),
      this.contextBuilder.buildImageAnalysisContext(analysis),
      buildVariationInstruction(variationMode),
      this.negativePromptBuilder.build(),
    ]);

    return promptLines.join("\n\n");
  }
}

const defaultPromptEngine = new PromptEngine();

export function buildProfessionalCricketPrompt(input: Parameters<PromptEngine["build"]>[0]) {
  return defaultPromptEngine.build(input);
}
