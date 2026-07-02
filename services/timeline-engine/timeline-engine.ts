import type { CreativeGenerationVersion, GenerationTimelineItem } from "@/types/creative-director";

export class TimelineEngine {
  build(versions: CreativeGenerationVersion[]): GenerationTimelineItem[] {
    return versions.map((version, index) => ({
      id: version.id,
      label: `Generation ${index + 1}`,
      rank: version.rank,
      strategyName: version.strategy.name,
      score: version.scores.overall,
      generatedAt: version.generatedAt,
      imageDataUrl: version.generatedImage.dataUrl,
    }));
  }
}
