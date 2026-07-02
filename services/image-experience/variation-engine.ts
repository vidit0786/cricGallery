import type { ImageVariationMode } from "@/types/ai";

export interface VariationAction {
  mode: ImageVariationMode;
  label: string;
  description: string;
}

export const PROFESSIONAL_VARIATIONS: VariationAction[] = [
  { mode: "generate_again", label: "Generate Again", description: "Create a fresh result with the same settings." },
  { mode: "more_realistic", label: "More Realistic", description: "Prioritize lifelike face, skin, equipment, and stadium detail." },
  { mode: "improve_face", label: "Improve Face", description: "Strengthen identity preservation, eyes, facial structure, and expression." },
  { mode: "improve_lighting", label: "Improve Lighting", description: "Improve shadows, highlights, contrast, and stadium exposure." },
  { mode: "improve_stadium", label: "Improve Stadium", description: "Enhance crowd depth, grass, field placement, and stadium atmosphere." },
  { mode: "different_camera_angle", label: "Different Camera", description: "Try a new professional sports camera perspective." },
  { mode: "different_celebration", label: "Different Celebration", description: "Generate a different celebration or emotional moment." },
  { mode: "different_jersey", label: "Different Jersey", description: "Refresh jersey styling while preserving team identity." },
];

export class VariationEngine {
  getActions() {
    return PROFESSIONAL_VARIATIONS;
  }

  getInstruction(mode: ImageVariationMode) {
    return PROFESSIONAL_VARIATIONS.find((action) => action.mode === mode)?.description ?? "Create a professional alternate cricket image.";
  }
}
