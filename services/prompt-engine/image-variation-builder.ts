import type { ImageVariationMode } from "@/types/ai";

const variationInstructions: Record<ImageVariationMode, string> = {
  generate_again:
    "Variation direction: generate again with the same selections, preserving identity and cricket realism while creating a fresh professional composition.",
  generate_4_variations:
    "Variation direction: create a distinct alternate version optimized as one of four professional variations; preserve identity, team, and cricket realism while changing composition subtly.",
  generate_8_variations:
    "Variation direction: create a distinct alternate version optimized as one of eight exploratory professional variations; preserve identity and core selections while making a fresh creative interpretation.",
  more_like_this:
    "Variation direction: generate more like the current result, preserving the same identity, pose, team, stadium, lighting, and photographic style while adding subtle composition freshness.",
  more_cinematic:
    "Variation direction: make the image more cinematic with stronger depth of field, dramatic stadium atmosphere, premium color grading, and controlled highlights.",
  more_realistic:
    "Variation direction: make the image more realistic with stricter anatomy, natural skin pores, authentic cricket equipment, believable crowd, and documentary sports-photography detail.",
  more_dramatic:
    "Variation direction: increase drama with stronger action timing, dynamic shadows, intense crowd energy, and powerful professional sports storytelling.",
  different_camera_angle:
    "Variation direction: change the camera angle while preserving identity, clothing, pose intent, stadium, team, and cricket realism.",
  different_lighting:
    "Variation direction: change the lighting treatment while keeping identity, scene, team, pose, and stadium consistent.",
  different_celebration:
    "Variation direction: create a different cricket celebration or emotional moment while preserving identity, team, and professional realism.",
  different_stadium:
    "Variation direction: use a noticeably different stadium composition or vantage point while preserving the selected stadium identity and team styling.",
  different_jersey:
    "Variation direction: create a different jersey styling pass while preserving official team colors, realistic fabric, identity, and cricket context.",
  improve_face:
    "Variation direction: improve face fidelity, sharper eyes, more accurate facial proportions, natural skin texture, and stronger identity preservation.",
  improve_lighting:
    "Variation direction: improve lighting with more natural shadows, better catchlights, HDR exposure, realistic reflections, and professional color grading.",
  improve_pose:
    "Variation direction: improve pose realism, cricket biomechanics, natural hands, correct grip, accurate pads/gloves/helmet, and stronger action timing.",
  improve_realism:
    "Variation direction: improve overall realism with stricter anatomy, equipment accuracy, natural crowd depth, realistic grass, and broadcast-quality sports photography.",
  improve_stadium:
    "Variation direction: improve stadium realism with better crowd depth, authentic grass, pitch scale, lighting rigs, boundary rope, field placement, and atmospheric detail.",
};

export function buildVariationInstruction(variationMode?: ImageVariationMode) {
  if (!variationMode) return null;
  return variationInstructions[variationMode];
}

export const IMAGE_VARIATION_OPTIONS: Array<{ mode: ImageVariationMode; label: string }> = [
  { mode: "generate_again", label: "Generate Again" },
  { mode: "more_realistic", label: "More Realistic" },
  { mode: "improve_face", label: "Improve Face" },
  { mode: "improve_lighting", label: "Improve Lighting" },
  { mode: "improve_stadium", label: "Improve Stadium" },
  { mode: "different_camera_angle", label: "Different Camera" },
  { mode: "different_celebration", label: "Different Celebration" },
  { mode: "different_jersey", label: "Different Jersey" },
  { mode: "different_lighting", label: "Different Lighting" },
  { mode: "different_stadium", label: "Different Stadium" },
  { mode: "more_cinematic", label: "More Cinematic" },
  { mode: "more_dramatic", label: "More Dramatic" },
];
