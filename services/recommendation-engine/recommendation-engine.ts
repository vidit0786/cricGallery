import type { CricketSelections } from "@/lib/cricket-options";
import type { RecommendationContext, RecommendationGroup, RecommendationOption } from "@/types/recommendation-types";
import { clampConfidence, confidenceToStars, includesAny } from "@/services/recommendation-utils/scoring";

function option<T extends string>(label: T, confidence: number, reason: string): RecommendationOption<T> {
  const safeConfidence = clampConfidence(confidence);
  return { label, confidence: safeConfidence, stars: confidenceToStars(safeConfidence), reason };
}

function sortTop<T extends string>(options: RecommendationOption<T>[]) {
  return [...options].sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

export class CricketRecommendationEngine {
  recommend(context: RecommendationContext) {
    const lowLight = includesAny(context.lighting, ["low", "dim", "night", "indoor", "shadow", "dark"]);
    const warmLight = includesAny(context.lighting, ["warm", "sunset", "golden"]);
    const openSpace = context.emptySpaceAroundSubject === "high" || context.emptySpaceAroundSubject === "medium";
    const fullBody = context.portraitVsFullBody === "full_body" || context.portraitVsFullBody === "half_body";
    const armsRaised = includesAny(context.armPosition, ["raised", "up", "open", "extended"]);
    const sideOn = includesAny(context.bodyOrientation, ["side", "angled", "three-quarter", "3/4"]);
    const frontFacing = includesAny(context.faceAngle, ["front", "facing camera"]);
    const outdoor = context.environmentType === "outdoor";
    const closeCamera = includesAny(context.cameraDistance, ["close", "portrait", "selfie"]);

    const groups: RecommendationGroup[] = [
      {
        category: "format",
        title: "Best Cricket Format",
        options: sortTop([
          option("IPL", 88 + (lowLight ? 5 : 0), "IPL works well for dramatic, colorful, high-energy cricket portraits."),
          option("ODI", 78 + (outdoor ? 5 : 0), "ODI is recommended when the image can support clean match-day realism."),
          option("World Cup", 76 + (frontFacing ? 6 : 0), "World Cup styling adds a heroic international tournament feel."),
          option("T20", 73 + (armsRaised ? 7 : 0), "T20 suits expressive, high-energy poses and modern stadium scenes."),
          option("Test", 62 + (outdoor ? 5 : 0), "Test cricket is a solid option for classic, composed cricket imagery."),
        ]),
      },
      {
        category: "role",
        title: "Best Player Role",
        options: sortTop([
          option("Batsman", 86 + (sideOn ? 8 : 0) + (fullBody ? 4 : 0), "Your body orientation and visible stance can be adapted naturally into a batting pose."),
          option("Captain", 80 + (frontFacing ? 8 : 0), "A front-facing or confident image works well for a captain-style hero portrait."),
          option("Wicket Keeper", 74 + (context.poseType === "sitting" ? 7 : 0), "A compact pose can translate into an alert wicket keeper stance."),
          option("All-rounder", 72 + (openSpace ? 5 : 0), "The available space supports a balanced action portrait."),
          option("Bowler", 58 + (context.poseType === "running" ? 20 : 0), "Bowling needs dynamic body movement, so it is strongest when the source pose has motion."),
        ]),
      },
      {
        category: "pose",
        title: "Best Pose",
        options: sortTop([
          option("Cover Drive", 88 + (sideOn ? 8 : 0), "We recommend Cover Drive because the body orientation can closely match a batting stance."),
          option("Straight Drive", 82 + (frontFacing ? 6 : 0), "Straight Drive works well when the subject faces camera or has a centered posture."),
          option("Trophy Lift", 78 + (armsRaised ? 14 : 0), "Trophy Lift is strong when arm position already suggests an upward or celebratory gesture."),
          option("Celebration", 76 + (armsRaised ? 12 : 0), "Celebration fits expressive body language and visible upper-body space."),
          option("Walking into Stadium", 68 + (context.poseType === "walking" ? 22 : 0), "Walking scenes work best when the source already suggests movement."),
        ]),
      },
      {
        category: "stadium",
        title: "Best Stadium",
        options: sortTop([
          option("M Chinnaswamy Stadium", 88, "Chinnaswamy pairs naturally with vibrant IPL-style scenes and RCB jersey recommendations."),
          option("Wankhede Stadium", 82 + (outdoor ? 4 : 0), "Wankhede is a strong professional stadium choice with cinematic match atmosphere."),
          option("Eden Gardens", 80 + (openSpace ? 4 : 0), "Eden Gardens adds grand crowd scale and classic cricket energy."),
          option("Narendra Modi Stadium", 76 + (openSpace ? 5 : 0), "Large stadium scale works well when there is enough subject space."),
          option("Lord's", 68, "Lord's is best for classic cricket presentation and composed portraits."),
        ]),
      },
      {
        category: "camera",
        title: "Best Camera Angle",
        options: sortTop([
          option("Broadcast Camera", 86 + (fullBody ? 6 : 0), "Broadcast camera works well for realistic action and stadium context."),
          option("Telephoto Lens", 82 + (outdoor ? 6 : 0), "Telephoto creates professional sports compression and crowd depth."),
          option("Close-up Portrait", 80 + (closeCamera ? 10 : 0), "Close-up portrait is recommended because the uploaded image already has a close camera distance."),
          option("Action Camera", 74 + (context.poseType === "running" ? 10 : 0), "Action camera supports dynamic cricket movement."),
          option("Wide Stadium", 70 + (openSpace ? 8 : 0), "Wide stadium works best when there is enough empty space around the subject."),
        ]),
      },
      {
        category: "lighting",
        title: "Best Lighting",
        options: sortTop([
          option("Floodlights", 88 + (lowLight ? 8 : 0), "Floodlights are recommended because the uploaded image can blend well with stadium lighting, especially in low-light scenes."),
          option("Golden Hour", 84 + (warmLight ? 9 : 0), "Golden Hour is recommended when existing lighting has warm or directional tones."),
          option("Night Match", 82 + (lowLight ? 7 : 0), "Night Match works well when the image already contains darker lighting conditions."),
          option("Afternoon", 74 + (!lowLight ? 6 : 0), "Afternoon lighting is a clean option for bright, realistic sports photography."),
          option("Rain Match", 66 + (includesAny(context.backgroundType, ["wet", "rain"]) ? 15 : 0), "Rain Match is strongest if the source or background already suggests wet conditions."),
        ]),
      },
      {
        category: "jersey",
        title: "Best Jersey",
        options: sortTop([
          option("RCB", 88 + (lowLight ? 4 : 0), "RCB is recommended for a premium IPL look with strong red/black contrast under stadium lights."),
          option("India", 82 + (frontFacing ? 4 : 0), "India works well for a polished international cricket hero portrait."),
          option("CSK", 78 + (warmLight ? 5 : 0), "CSK pairs well with warm lighting and energetic stadium scenes."),
          option("MI", 74, "MI is a strong professional jersey choice with bold blue stadium styling."),
          option("KKR", 70 + (lowLight ? 5 : 0), "KKR works well for dramatic, night-match color grading."),
        ]),
      },
    ];

    const bestSettings: CricketSelections = {
      format: groups[0].options[0].label as CricketSelections["format"],
      role: groups[1].options[0].label as CricketSelections["role"],
      pose: groups[2].options[0].label as CricketSelections["pose"],
      stadium: groups[3].options[0].label as CricketSelections["stadium"],
      cameraStyle: groups[4].options[0].label as CricketSelections["cameraStyle"],
      lightingStyle: groups[5].options[0].label as CricketSelections["lightingStyle"],
      team: groups[6].options[0].label as CricketSelections["team"],
      matchTime: lowLight ? "Night Match" : warmLight ? "Sunset Match" : "Day Match",
      officialTeamColors: true,
      qualityLevel: "Ultra",
    };

    const confidenceValues = groups.map((group) => group.options[0].confidence);
    const overallConfidence = clampConfidence(confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length);

    return {
      groups,
      bestSettings,
      overallConfidence,
      summary: `Best match: ${bestSettings.role} in ${bestSettings.team} colors at ${bestSettings.stadium}, using ${bestSettings.cameraStyle} and ${bestSettings.lightingStyle}.`,
    };
  }
}
