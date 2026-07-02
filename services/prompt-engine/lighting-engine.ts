import type { LightingStyle, MatchTime } from "@/lib/cricket-options";

const lightingInstructions: Record<LightingStyle, string> = {
  Morning:
    "Lighting: clean morning light with natural contrast, accurate soft shadows, fresh grass reflections, and balanced exposure.",
  "Golden Hour":
    "Lighting: cinematic golden-hour sunlight, warm highlights, realistic rim light, long natural shadows, and professional color grading.",
  Afternoon:
    "Lighting: bright afternoon stadium light, high dynamic range, controlled highlights, correct shadow direction, and crisp exposure.",
  "Night Match":
    "Lighting: realistic night match atmosphere with stadium floodlights, controlled contrast, natural skin highlights, and deep background ambience.",
  Floodlights:
    "Lighting: powerful professional floodlights, realistic specular reflections on helmet and pads, clean catchlights in the eyes, and natural shadows.",
  "Rain Match":
    "Lighting: dramatic rainy match lighting with wet grass reflections, realistic water droplets, moody contrast, and clear face visibility.",
  Cloudy:
    "Lighting: cloudy diffused daylight, soft natural shadows, balanced skin tones, and realistic overcast stadium atmosphere.",
  Sunset:
    "Lighting: sunset stadium scene with orange-pink sky, controlled silhouettes, natural rim light, and cinematic sports photography color grade.",
};

const matchTimeMood: Record<MatchTime, string> = {
  "Day Match": "day-match realism with clear sky exposure and accurate pitch brightness",
  "Night Match": "night-match intensity with realistic floodlit field and crowd atmosphere",
  "Sunset Match": "sunset-match drama with warm tones and cinematic sky color",
  "Rain Match": "rain-match atmosphere with wet ground reflections and dramatic contrast",
};

export function buildLightingInstruction(lightingStyle: LightingStyle, matchTime: MatchTime) {
  return `${lightingInstructions[lightingStyle]} Match-time mood: ${matchTimeMood[matchTime]}.`;
}
