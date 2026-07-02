import type { PromptPreset } from "@/lib/cricket-options";

const presetInstructions: Record<PromptPreset, string> = {
  "Epic IPL":
    "Prompt preset: Epic IPL — high-energy franchise cricket, dramatic floodlights, saturated premium team colors, packed crowd, broadcaster hero framing, cinematic impact.",
  "World Cup Hero":
    "Prompt preset: World Cup Hero — global tournament atmosphere, national pride, iconic trophy-era mood, premium stadium scale, heroic professional sports portrait.",
  "Legendary Captain":
    "Prompt preset: Legendary Captain — commanding leadership pose, tactical authority, mature sports confidence, premium captain aura, clean professional composition.",
  "Match Winner":
    "Prompt preset: Match Winner — decisive game-winning moment, emotional intensity, realistic crowd reaction, sharp action detail, triumphant sports photography.",
  "Training Session":
    "Prompt preset: Training Session — professional practice environment, focused athlete energy, nets or warm-up context, authentic gear placement, documentary realism.",
  "Press Conference":
    "Prompt preset: Press Conference — controlled media-room lighting, realistic microphones, official team apparel, serious professional expression, no fake readable text.",
  "Victory Celebration":
    "Prompt preset: Victory Celebration — confetti or stadium celebration atmosphere, trophy or teammate energy when appropriate, premium victory photography, natural emotion.",
};

export function buildPromptPresetInstruction(promptPreset?: PromptPreset) {
  return promptPreset ? presetInstructions[promptPreset] : null;
}
