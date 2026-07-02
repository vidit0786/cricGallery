import type { CreativeGenerationVersion } from "@/types/creative-director";

export class ComparisonEngine {
  compare(left: CreativeGenerationVersion, right: CreativeGenerationVersion) {
    return {
      leftId: left.id,
      rightId: right.id,
      scoreDelta: right.scores.overall - left.scores.overall,
      stronger: right.scores.overall >= left.scores.overall ? right.id : left.id,
      summary:
        right.scores.overall >= left.scores.overall
          ? `${right.strategy.name} is stronger by ${right.scores.overall - left.scores.overall} points.`
          : `${left.strategy.name} is stronger by ${left.scores.overall - right.scores.overall} points.`,
    };
  }
}
