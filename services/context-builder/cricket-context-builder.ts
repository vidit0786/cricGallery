import type { CricketSelections } from "@/lib/cricket-options";
import type { ImageAnalysis } from "@/types/ai";
import type { CricketRecommendationResult } from "@/types/recommendation-types";
import type { CricketContext } from "@/types/prompt-pipeline";

function value<T>(primary: T | undefined | null, fallback: T): T {
  return primary ?? fallback;
}

function identityDetails(analysis: ImageAnalysis) {
  return [
    analysis.face.detected ? "face detected and should be preserved" : "face not confidently detected; preserve visible identity cues",
    analysis.face.angle ? `face angle: ${analysis.face.angle}` : null,
    analysis.face.expression ? `expression: ${analysis.face.expression}` : null,
    analysis.hairStyle ? `hair style: ${analysis.hairStyle}` : null,
    analysis.hairColor ? `hair color: ${analysis.hairColor}` : null,
    analysis.beardOrMoustache ? `facial hair: ${analysis.beardOrMoustache}` : null,
    analysis.glasses ? `glasses: ${analysis.glasses}` : null,
    analysis.skinTone ? `natural visible skin tone: ${analysis.skinTone}` : null,
  ].filter(Boolean) as string[];
}

export class CricketContextBuilder {
  build({
    analysis,
    selections,
    recommendations,
  }: {
    analysis: ImageAnalysis;
    selections: CricketSelections;
    recommendations: CricketRecommendationResult;
  }): CricketContext {
    const recommended = recommendations.bestSettings;
    const role = value(selections.role, recommended.role ?? "Batsman");
    const pose = value(selections.battingShot ?? selections.bowlingAction ?? selections.celebrationStyle ?? selections.pose, recommended.pose ?? "Cover Drive");
    const lighting = value(selections.lightingStyle, recommended.lightingStyle ?? "Floodlights");
    const camera = value(selections.cameraStyle, recommended.cameraStyle ?? "Broadcast Camera");
    const stadium = value(selections.stadium, recommended.stadium ?? "M Chinnaswamy Stadium");
    const matchType = value(selections.format, recommended.format ?? "IPL");
    const team = value(selections.team, recommended.team ?? "RCB");

    return {
      playerRole: role,
      pose,
      lighting,
      camera,
      background: analysis.backgroundType ?? analysis.background ?? "professional cricket stadium background",
      stadium,
      matchType,
      weather: selections.stadiumEffect && selections.stadiumEffect !== "None" ? selections.stadiumEffect : selections.matchTime ?? "clear match atmosphere",
      mood: selections.promptPreset ?? recommendations.summary,
      crowd: selections.crowdLevel ?? "Packed Crowd",
      jersey: [
        `${team} official cricket jersey`,
        selections.playerName ? `name ${selections.playerName}` : null,
        selections.jerseyNumber ? `number ${selections.jerseyNumber}` : null,
        selections.captainBadge ? "captain badge" : null,
        selections.viceCaptainBadge ? "vice-captain badge" : null,
        selections.sleeveStyle,
        selections.fitStyle,
        selections.officialTeamColors ? "official team colors" : null,
      ].filter(Boolean).join(", "),
      identityDetails: identityDetails(analysis),
      composition: `${camera}, ${selections.aspectRatio ?? "16:9"}, ${analysis.portraitVsFullBody ?? "subject-focused"}, ${analysis.emptySpaceAroundSubject ?? "medium"} empty space`,
      cricketAccuracy: [
        "correct cricket bat proportions",
        "correct cricket ball scale",
        "realistic pads, gloves, helmet, trousers and shoes",
        "authentic cricket grip and biomechanics",
        "realistic pitch, grass, field placement and stadium lighting",
      ],
      userChoices: selections,
      recommendations,
      imageAnalysis: analysis,
    };
  }
}
