import type { CricketPose, PlayerRole } from "@/lib/cricket-options";

export type PromptTemplateKey = "batting" | "bowling" | "captain" | "keeper" | "celebration" | "practice" | "press_conference";

export interface PromptTemplate {
  key: PromptTemplateKey;
  title: string;
  lines: string[];
}

const templates: Record<PromptTemplateKey, PromptTemplate> = {
  batting: {
    key: "batting",
    title: "Batting",
    lines: [
      "Template: Batting — authentic batting stance, balanced head position, correct footwork, realistic batting gloves, pads, helmet, and bat grip.",
      "The bat must have correct proportions, correct face angle, natural wood texture, and believable interaction with hands and ball trajectory.",
      "Use professional sports action timing, sharp eyes, natural body rotation, and realistic pitch scale.",
    ],
  },
  bowling: {
    key: "bowling",
    title: "Bowling",
    lines: [
      "Template: Bowling — authentic bowling action with realistic run-up energy, shoulder rotation, wrist position, release point, and follow-through.",
      "The cricket ball must have correct size and seam detail where visible, with natural arm anatomy and balanced body mechanics.",
      "Use professional bowling shoes, official trousers, jersey movement, and believable pitch contact.",
    ],
  },
  captain: {
    key: "captain",
    title: "Captain",
    lines: [
      "Template: Captain — commanding leadership presence, tactical field awareness, confident expression, premium captain aura, and clean broadcast composition.",
      "Use subtle captain badge cues when selected, mature decision-maker posture, and stadium-scale professional cricket atmosphere.",
    ],
  },
  keeper: {
    key: "keeper",
    title: "Keeper",
    lines: [
      "Template: Keeper — wicket keeper realism with correct gloves, pads, crouched alert posture, stumps alignment, and accurate distance behind the wicket.",
      "Keep gloves anatomically correct, face sharp under helmet or cap styling, and body position ready for a catch or stumping.",
    ],
  },
  celebration: {
    key: "celebration",
    title: "Celebration",
    lines: [
      "Template: Celebration — genuine cricket emotion, believable victory gesture, natural expression, and realistic crowd response.",
      "Avoid duplicate people, distorted hands, or exaggerated non-photographic emotion; keep the main subject clearly recognizable.",
    ],
  },
  practice: {
    key: "practice",
    title: "Practice",
    lines: [
      "Template: Practice — professional training-session environment, practice nets or drill context, focused athlete mood, and authentic equipment placement.",
      "Use documentary sports realism, natural training light, clear subject identity, and believable ground texture.",
    ],
  },
  press_conference: {
    key: "press_conference",
    title: "Press Conference",
    lines: [
      "Template: Press Conference — realistic cricket media room, professional desk setup, microphones, controlled soft lighting, and official team attire.",
      "Avoid fake readable text, corrupted sponsor logos, random placards, and unnatural microphone clutter.",
    ],
  },
};

export class PromptTemplates {
  select(pose: CricketPose, role: PlayerRole): PromptTemplate {
    if (role === "Captain") return templates.captain;
    if (role === "Wicket Keeper") return templates.keeper;
    if (pose === "Celebration" || pose === "Appeal" || pose === "Holding Trophy" || pose === "Trophy Lift") return templates.celebration;
    if (pose === "Practice Nets") return templates.practice;
    if (pose === "Press Conference" || role === "Coach") return templates.press_conference;
    if (["Fast Bowling", "Spin Bowling"].includes(pose)) return templates.bowling;
    return templates.batting;
  }

  buildBlock(template: PromptTemplate) {
    return [`Prompt Template: ${template.title}.`, ...template.lines].join("\n");
  }
}

const promptTemplates = new PromptTemplates();

export function selectPromptTemplate(pose: CricketPose, role: PlayerRole): PromptTemplate {
  return promptTemplates.select(pose, role);
}

export function buildTemplateBlock(template: PromptTemplate) {
  return promptTemplates.buildBlock(template);
}
