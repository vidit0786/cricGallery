import type { CricketContext, PromptOptimization } from "@/types/prompt-pipeline";

const fragmentCache = new Map<string, string>();

export class PromptOptimizerStage {
  optimize(context: CricketContext) {
    const cacheKey = `${context.playerRole}:${context.pose}:${context.camera}:${context.lighting}:${context.stadium}:${context.matchType}`;
    const cached = fragmentCache.get(cacheKey);

    const optimizations: PromptOptimization[] = [
      {
        title: "Photorealism",
        after: "high-end photorealistic sports photography with natural skin texture and realistic stadium atmosphere",
        reason: "Photorealism improves believability and avoids illustration-like outputs.",
      },
      {
        title: "Identity Preservation",
        after: `preserve identity details: ${context.identityDetails.join("; ")}`,
        reason: "The image analysis provides visible identity cues that should remain stable.",
      },
      {
        title: "Lighting and Shadows",
        after: `${context.lighting}, natural shadows, realistic highlights, balanced exposure`,
        reason: "Lighting consistency helps the face and stadium feel like one real scene.",
      },
      {
        title: "Composition and Lens",
        after: `${context.camera}, ${context.composition}, professional depth of field`,
        reason: "Camera and composition are optimized from user choices and recommendations.",
      },
      {
        title: "Cricket Accuracy",
        after: context.cricketAccuracy.join("; "),
        reason: "Cricket equipment and biomechanics must be correct for a professional result.",
      },
    ];

    if (cached) return { block: cached, optimizations };

    const block = [
      "PROMPT OPTIMIZER STAGE:",
      ...optimizations.map((optimization) => `${optimization.title}: ${optimization.after}.`),
      "Use appropriate motion blur only for fast bowling, running, or dynamic action; keep face and eyes sharp.",
      "Use crowd realism, natural shadows, correct cricket equipment, broadcast quality, and professional sports photography detail.",
    ].join("\n");

    fragmentCache.set(cacheKey, block);
    return { block, optimizations };
  }
}
