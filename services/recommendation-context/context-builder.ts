import type { ImageAnalysis } from "@/types/ai";
import type { RecommendationContext } from "@/types/recommendation-types";

export class RecommendationContextBuilder {
  build(analysis: ImageAnalysis): RecommendationContext {
    const poseType = analysis.runningPose
      ? "running"
      : analysis.walkingPose
        ? "walking"
        : analysis.sittingPose
          ? "sitting"
          : analysis.standingPose
            ? "standing"
            : "unknown";

    return {
      analysis,
      faceAngle: analysis.face.angle,
      headDirection: analysis.headDirection ?? null,
      bodyOrientation: analysis.bodyOrientation,
      poseType,
      armPosition: analysis.armPosition ?? null,
      cameraDistance: analysis.cameraDistance ?? null,
      backgroundType: analysis.backgroundType ?? analysis.background,
      environmentType: analysis.environmentType ?? "uncertain",
      lighting: analysis.lighting,
      imageQuality: analysis.imageQuality,
      portraitVsFullBody: analysis.portraitVsFullBody ?? "uncertain",
      emptySpaceAroundSubject: analysis.emptySpaceAroundSubject ?? "medium",
    };
  }
}
