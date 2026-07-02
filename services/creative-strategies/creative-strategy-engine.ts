import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis } from "@/types/ai";
import type { CreativeStrategy } from "@/types/creative-director";

const strategies: CreativeStrategy[] = [
  {
    id: "sports-broadcast",
    name: "Sports Broadcast",
    promptInstruction:
      "Creative Strategy: Sports Broadcast — realistic broadcast match frame, professional telecast angle, accurate field, crowd depth, natural sports action timing.",
    reason: "Best for authentic match realism and cricket action clarity.",
    idealFor: ["action", "stadium", "broadcast", "batting", "bowling"],
  },
  {
    id: "cinematic-hero",
    name: "Movie Poster",
    promptInstruction:
      "Creative Strategy: Cinematic Hero Shot — dramatic hero framing, premium cinematic lighting, powerful athlete presence, poster-grade composition, realistic stadium atmosphere.",
    reason: "Best for a premium emotional hero image with strong visual impact.",
    idealFor: ["portrait", "hero", "captain", "poster"],
  },
  {
    id: "world-cup-poster",
    name: "ICC Promotional",
    promptInstruction:
      "Creative Strategy: World Cup Poster — international tournament energy, polished ICC-style promotional sports photography, grand stadium, trophy-era atmosphere.",
    reason: "Best for international or World Cup style scenes.",
    idealFor: ["world cup", "international", "poster", "trophy"],
  },
  {
    id: "magazine-cover",
    name: "Sports Magazine",
    promptInstruction:
      "Creative Strategy: Sports Magazine — premium editorial cover style, clean athlete portrait, refined color grading, sharp facial detail, professional layout-safe composition without text.",
    reason: "Best for close portraits, clean identity preservation, and polished editorial output.",
    idealFor: ["portrait", "close", "magazine", "face"],
  },
  {
    id: "ipl-promotional",
    name: "IPL Promotional",
    promptInstruction:
      "Creative Strategy: IPL Promotional — vibrant franchise colors, energetic floodlit stadium, packed crowd, dramatic cricket branding feel without fake text or logos.",
    reason: "Best for colorful IPL scenes and dramatic stadium lighting.",
    idealFor: ["ipl", "night", "franchise", "crowd"],
  },
  {
    id: "victory-celebration",
    name: "Victory Celebration",
    promptInstruction:
      "Creative Strategy: Victory Celebration — emotional celebration, trophy or raised bat energy, realistic crowd reaction, confetti when appropriate, identity sharp and natural.",
    reason: "Best when the source pose or selected concept implies triumph.",
    idealFor: ["celebration", "trophy", "raise", "arms"],
  },
  {
    id: "training-session",
    name: "Training Session",
    promptInstruction:
      "Creative Strategy: Training Session — professional nets or practice-ground environment, focused athlete realism, authentic training equipment, documentary sports photography.",
    reason: "Best for practice, coach, or understated documentary scenes.",
    idealFor: ["training", "practice", "coach", "nets"],
  },
  {
    id: "stadium-entrance",
    name: "Stadium Entrance",
    promptInstruction:
      "Creative Strategy: Stadium Entrance — player walking into stadium, tunnel or boundary entry, cinematic anticipation, crowd scale, natural kit movement.",
    reason: "Best when the image suggests walking or full-body presence.",
    idealFor: ["walking", "entrance", "full_body"],
  },
];

function scoreStrategy(strategy: CreativeStrategy, analysis: ImageAnalysis, selections: CricketSelections) {
  const text = [
    selections.format,
    selections.role,
    selections.pose,
    selections.promptPreset,
    selections.lightingStyle,
    analysis.pose,
    analysis.cameraDistance,
    analysis.portraitVsFullBody,
    analysis.armPosition,
    analysis.lighting,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 60;
  for (const term of strategy.idealFor) if (text.includes(term)) score += 8;
  if (strategy.name === "Sports Broadcast") score += 10;
  if (selections.format === "IPL" && strategy.name === "IPL Promotional") score += 16;
  if (selections.format === "World Cup" && strategy.name === "ICC Promotional") score += 16;
  if (selections.pose === "Celebration" && strategy.name === "Victory Celebration") score += 18;
  if (selections.pose === "Practice Nets" && strategy.name === "Training Session") score += 18;
  if (analysis.portraitVsFullBody === "portrait" && strategy.name === "Sports Magazine") score += 12;
  return score;
}

export class CreativeStrategyEngine {
  selectStrategies({ analysis, selections, count }: { analysis: ImageAnalysis; selections: CricketSelections; count: number }) {
    return [...strategies]
      .map((strategy) => ({ strategy, score: scoreStrategy(strategy, analysis, selections) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, Math.min(count, strategies.length)))
      .map(({ strategy, score }) => ({ ...strategy, reason: `${strategy.reason} Strategy fit score: ${Math.round(score)}.` }));
  }
}

export { strategies as CREATIVE_STRATEGIES };
