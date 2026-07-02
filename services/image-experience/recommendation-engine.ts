import type { CricketSelections } from "@/lib/cricket-options";

export interface RecommendationAction {
  id: string;
  label: string;
  description: string;
  patch: Partial<CricketSelections>;
}

export class RecommendationEngine {
  suggest(selections: CricketSelections): RecommendationAction[] {
    const alreadyPacked = selections.crowdLevel === "Packed Crowd";

    return [
      { id: "world-cup", label: "World Cup Version", description: "Turn this into a global tournament hero scene.", patch: { format: "World Cup" } },
      { id: "night-match", label: "Night Match", description: "Use floodlit stadium drama and high contrast.", patch: { matchTime: "Night Match", lightingStyle: "Floodlights" } },
      { id: "rain-match", label: "Rain Match", description: "Add wet grass, rain reflections, and moody realism.", patch: { matchTime: "Rain Match", lightingStyle: "Rain Match", stadiumEffect: "Rain" } },
      { id: "golden-hour", label: "Golden Hour", description: "Create warm cinematic sunset sports photography.", patch: { lightingStyle: "Golden Hour", stadiumEffect: "Golden Hour Glow" } },
      { id: "packed-stadium", label: alreadyPacked ? "Keep Packed Stadium" : "Packed Stadium", description: "Increase scale and crowd energy.", patch: { crowdLevel: "Packed Crowd" } },
      { id: "training", label: "Training Session", description: "Create a focused practice nets version.", patch: { pose: "Practice Nets", promptPreset: "Training Session" } },
      { id: "victory", label: "Victory Celebration", description: "Make the result more triumphant and emotional.", patch: { pose: "Celebration", celebrationStyle: "Trophy Lift", promptPreset: "Victory Celebration" } },
    ];
  }
}
