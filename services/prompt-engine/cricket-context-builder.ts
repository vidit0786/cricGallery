import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis } from "@/types/ai";
import { AppError } from "@/utils/api-errors";

function requireSelection<T>(value: T | undefined, label: string): T {
  if (!value) throw new AppError(`Please select ${label} before generating.`, 400, "INVALID_REQUEST");
  return value;
}

function present(label: string, value: string | null | undefined) {
  return value ? `${label}: ${value}.` : null;
}

function compact(lines: Array<string | null | undefined>) {
  return lines.filter(Boolean) as string[];
}

export class CricketContextBuilder {
  buildIdentityContext(analysis: ImageAnalysis) {
    return compact([
      "IDENTITY PRESERVATION — highest priority:",
      "Use the uploaded image as the identity source. Preserve the person's recognizable face as accurately as the selected image model supports.",
      "Preserve face shape, eyes, eye spacing, nose, lips, jawline, cheek structure, chin, forehead proportions, facial proportions, natural asymmetry, and skin texture.",
      "Preserve hair style, hairline, hair color, beard, moustache, glasses if visible, facial expression, gaze direction, and natural skin tone.",
      "Do not beautify, age-shift, gender-shift, caricature, or replace the identity with a different person.",
      present("Face location to respect", analysis.face.location ? JSON.stringify(analysis.face.location) : null),
      present("Face angle to preserve", analysis.face.angle),
      present("Facial expression to preserve", analysis.face.expression),
      present("Hair style to preserve", analysis.hairStyle),
      present("Hair color to preserve", analysis.hairColor),
      present("Beard or moustache to preserve", analysis.beardOrMoustache),
      present("Glasses to preserve if visible", analysis.glasses),
      present("Visible skin tone to preserve naturally", analysis.skinTone),
      present("Original camera angle to respect", analysis.cameraAngle),
      present("Original lighting cues to harmonize", analysis.lighting),
      present("Original pose context", analysis.pose),
      present("Body orientation to respect", analysis.bodyOrientation),
    ]).join("\n");
  }

  buildCricketContext(selections: CricketSelections) {
    const format = requireSelection(selections.format, "a cricket format");
    const team = requireSelection(selections.team, "a team");
    const role = requireSelection(selections.role, "a player role");
    const pose = requireSelection(selections.pose, "a cricket pose");
    const stadium = requireSelection(selections.stadium, "a stadium");
    const matchTime = requireSelection(selections.matchTime, "a match time");

    const action = selections.battingShot ?? selections.bowlingAction ?? selections.celebrationStyle ?? pose;

    return compact([
      "CRICKET CONTEXT ENGINE:",
      `Cricket format: ${format}.`,
      `Team identity: ${team}.`,
      `Player role: ${role}.`,
      `Primary cricket action: ${action}.`,
      `Venue: ${stadium}.`,
      `Match time: ${matchTime}.`,
      selections.crowdLevel ? `Crowd level: ${selections.crowdLevel}.` : null,
      selections.stadiumEffect && selections.stadiumEffect !== "None" ? `Stadium effect: ${selections.stadiumEffect}.` : null,
      "Ensure cricket accuracy: correct batting grip, bowling release, wicket keeper gloves, pads, helmet, trousers, shoes, ball size, bat size, pitch scale, field placement, and stadium lighting.",
      "Use professional sports photography realism: sharp face, clean eyes, natural skin, realistic jersey fabric, accurate equipment contact, crowd depth, and broadcast-quality composition.",
    ]).join("\n");
  }

  buildJerseyContext(selections: CricketSelections) {
    return compact([
      "JERSEY CUSTOMIZATION ENGINE:",
      selections.playerName ? `Player name on jersey: ${selections.playerName}.` : null,
      selections.jerseyNumber ? `Jersey number: ${selections.jerseyNumber}.` : null,
      selections.captainBadge ? "Add a captain badge with subtle official match styling." : null,
      selections.viceCaptainBadge ? "Add a vice-captain badge with subtle official match styling." : null,
      selections.sleeveStyle ? `Sleeve style: ${selections.sleeveStyle}.` : null,
      selections.fitStyle ? `Fit style: ${selections.fitStyle}.` : null,
      selections.officialTeamColors ? "Use official team color inspiration with realistic fabric and avoid corrupted readable logos." : null,
    ]).join("\n");
  }

  buildImageAnalysisContext(analysis: ImageAnalysis) {
    return compact([
      "SOURCE IMAGE ANALYSIS CONTEXT:",
      present("Detected clothing", analysis.clothingDescription),
      present("Detected background", analysis.background),
      present("Detected lighting", analysis.lighting),
      present("Detected camera angle", analysis.cameraAngle),
      present("Detected image quality", analysis.imageQuality),
      analysis.genderPresentation ? `Visible gender presentation, only if relevant for styling: ${analysis.genderPresentation}.` : null,
      analysis.estimatedAgeRange ? `Broad visible age range, only for proportion realism: ${analysis.estimatedAgeRange}.` : null,
      analysis.notes.length ? `Analysis notes: ${analysis.notes.join("; ")}.` : null,
    ]).join("\n");
  }
}
