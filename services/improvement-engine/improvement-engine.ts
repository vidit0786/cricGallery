import type { GenerationScores, ImprovementSuggestion } from "@/types/creative-director";

export class ImprovementEngine {
  suggest(scores: GenerationScores): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    if (scores.facialQuality < 92) {
      suggestions.push({ id: "improve-face", label: "Improve Face", description: "Increase identity fidelity, eye clarity, facial proportions, and skin texture.", variationMode: "improve_face", expectedGain: 6 });
    }
    if (scores.lighting < 92) {
      suggestions.push({ id: "improve-lighting", label: "Improve Lighting", description: "Improve natural shadows, exposure, highlights, and stadium light balance.", variationMode: "improve_lighting", expectedGain: 5 });
    }
    if (scores.backgroundQuality < 90) {
      suggestions.push({ id: "improve-stadium", label: "Improve Stadium", description: "Improve stadium realism, crowd depth, field placement, and grass texture.", variationMode: "improve_stadium", expectedGain: 5 });
    }
    if (scores.composition < 90) {
      suggestions.push({ id: "improve-camera", label: "Improve Camera Angle", description: "Try a cleaner professional sports camera angle and stronger subject framing.", variationMode: "different_camera_angle", expectedGain: 4 });
    }
    if (scores.cricketAccuracy < 92) {
      suggestions.push({ id: "improve-pose", label: "Improve Pose", description: "Improve cricket biomechanics, equipment grip, pads, gloves, and action accuracy.", variationMode: "improve_pose", expectedGain: 5 });
    }
    if (scores.overallRealism < 92) {
      suggestions.push({ id: "improve-realism", label: "Improve Realism", description: "Increase documentary realism, skin detail, natural anatomy, and broadcast quality.", variationMode: "improve_realism", expectedGain: 6 });
    }
    suggestions.push({ id: "improve-jersey", label: "Improve Jersey", description: "Refresh official jersey styling while preserving team colors and identity.", variationMode: "different_jersey", expectedGain: 3 });
    suggestions.push({ id: "cinematic-style", label: "Improve Cinematic Style", description: "Increase cinematic impact with better color grade, contrast, and depth of field.", variationMode: "more_cinematic", expectedGain: 4 });

    return suggestions.slice(0, 8);
  }
}
