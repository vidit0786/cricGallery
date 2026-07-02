"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Sparkles } from "lucide-react";

import { CreativeDirectorPanel } from "@/components/creative-director/creative-director-panel";
import { BeforeAfterCompare } from "@/components/studio/before-after-compare";
import { GalleryManagerPanel } from "@/components/studio/gallery-manager-panel";
import { PromptPanel } from "@/components/studio/prompt-panel";
import { ImagePreview } from "@/components/upload/image-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CricketSelections } from "@/lib/cricket-options";
import type { CricketGenerationResult, ImageQualityScore, ImageVariationMode } from "@/types/ai";
import { formatFileSize, getFileExtension, type UploadedImage } from "@/lib/image-upload";
import { performanceManager, RecommendationEngine, VariationEngine } from "@/services/image-experience";
import { DOWNLOAD_PRESETS, downloadImageWithPreset, type DownloadPresetId } from "@/utils/image-download";

interface AiGenerationResultProps {
  originalImage: UploadedImage;
  result: CricketGenerationResult;
  onGenerateVariation: (variationMode: ImageVariationMode) => void;
  onApplyRecommendation?: (patch: Partial<CricketSelections>) => void;
  selections?: CricketSelections;
  isGeneratingAnother?: boolean;
}

function QualityBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <span className="font-black text-primary">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function QualityScoreCard({ score }: { score: ImageQualityScore }) {
  return (
    <Card className="border-primary/25 bg-primary/[0.06]">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Quality Score</p>
            <CardTitle className="mt-2">Professional sports readiness</CardTitle>
          </div>
          <div className="grid size-16 place-items-center rounded-3xl bg-primary text-2xl font-black text-primary-foreground">
            {score.overall}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <QualityBar label="Identity" value={score.identityPreservation} />
        <QualityBar label="Realism" value={score.realism} />
        <QualityBar label="Lighting" value={score.lighting} />
        <QualityBar label="Composition" value={score.composition} />
        <QualityBar label="Cricket Accuracy" value={score.cricketAccuracy} />
        <QualityBar label="Photo Quality" value={score.photographicQuality} />
        {score.promptCompleteness ? <QualityBar label="Prompt Complete" value={score.promptCompleteness} /> : null}
        <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-muted-foreground">
          {score.summary}
        </p>
        {score.recommendations.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
            {score.recommendations.map((recommendation) => (
              <li key={recommendation}>{recommendation}</li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}

/** Final result view showing original image, AI output, prompt, quality score, and user actions. */
export function AiGenerationResult({
  originalImage,
  result,
  onGenerateVariation,
  onApplyRecommendation,
  selections = {},
  isGeneratingAnother = false,
}: AiGenerationResultProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<DownloadPresetId>("hd");
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const selectedPreset = useMemo(
    () => DOWNLOAD_PRESETS.find((preset) => preset.id === selectedPresetId) ?? DOWNLOAD_PRESETS[0],
    [selectedPresetId],
  );

  useEffect(() => {
    performanceManager.cacheImage(result.savedImageId ?? result.generatedAt ?? "latest", result.generatedImage.dataUrl);
  }, [result.generatedAt, result.generatedImage.dataUrl, result.savedImageId]);

  const variationActions = useMemo(() => new VariationEngine().getActions(), []);
  const recommendations = useMemo(() => new RecommendationEngine().suggest(selections), [selections]);

  const downloadImage = async () => {
    try {
      setDownloadError(null);
      await downloadImageWithPreset(result.generatedImage.dataUrl, selectedPreset);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "Could not download the image. Try another preset.");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_360px]">
        <div>
          <h3 className="mb-3 text-lg font-black text-foreground">Original image</h3>
          <ImagePreview
            previewUrl={originalImage.previewUrl}
            fileName={originalImage.file.name}
            fileSize={formatFileSize(originalImage.file.size)}
            fileType={originalImage.file.type || getFileExtension(originalImage.file.name).toUpperCase()}
          />
        </div>

        <div>
          <h3 className="mb-3 text-lg font-black text-foreground">Generated cricket image</h3>
          <Card className="overflow-hidden border-primary/30 bg-primary/[0.06]">
            <CardContent className="p-4">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30">
                <Image
                  src={result.generatedImage.dataUrl}
                  alt="Generated realistic cricket image"
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                <select
                  value={selectedPresetId}
                  onChange={(event) => setSelectedPresetId(event.target.value as DownloadPresetId)}
                  className="h-11 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                  aria-label="Download image size"
                >
                  {DOWNLOAD_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id} className="bg-card text-foreground">
                      {preset.label} — {preset.width}×{preset.height}
                    </option>
                  ))}
                </select>
                <Button type="button" onClick={downloadImage}>
                  <Download aria-hidden="true" /> Download
                </Button>
              </div>
              {downloadError ? <p className="mt-3 text-sm text-destructive">{downloadError}</p> : null}
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Provider: {result.generatedImage.provider} · Model: {result.generatedImage.model} · Prompt Version {result.promptVersion}
                {result.generationTimeMs ? ` · ${(result.generationTimeMs / 1000).toFixed(1)}s` : ""}
                {result.generatedAt ? ` · ${new Date(result.generatedAt).toLocaleString()}` : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        <QualityScoreCard score={result.qualityScore} />
      </div>

      {result.creativeDirector ? (
        <CreativeDirectorPanel
          originalImageUrl={originalImage.previewUrl}
          result={result.creativeDirector}
          onImprove={onGenerateVariation}
          isGenerating={isGeneratingAnother}
        />
      ) : (
        <BeforeAfterCompare
          beforeSrc={originalImage.previewUrl}
          afterSrc={result.generatedImage.dataUrl}
          beforeAlt="Original uploaded cricket source"
          afterAlt="Generated cricket result"
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">One-click variations</p>
              <CardTitle className="mt-2">Regenerate with quality directions</CardTitle>
            </div>
            <Sparkles className="size-6 text-primary" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {variationActions.map((option) => (
            <Button
              key={option.mode}
              type="button"
              variant="outline"
              onClick={() => onGenerateVariation(option.mode)}
              disabled={isGeneratingAnother}
              className="justify-start"
              title={option.description}
            >
              <RefreshCw className={isGeneratingAnother ? "animate-spin" : undefined} aria-hidden="true" />
              {option.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended next versions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((recommendation) => (
            <Button
              key={recommendation.id}
              type="button"
              variant="outline"
              className="h-auto justify-start whitespace-normal py-3 text-left"
              title={recommendation.description}
              onClick={() => onApplyRecommendation?.(recommendation.patch)}
              disabled={!onApplyRecommendation}
            >
              {recommendation.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery management</CardTitle>
        </CardHeader>
        <CardContent>
          <GalleryManagerPanel imageId={result.savedImageId} />
        </CardContent>
      </Card>

      <PromptPanel title="Prompt Used" prompt={result.prompt} details={result.promptDetails} />

      <Card>
        <CardHeader>
          <CardTitle>Structured image analysis JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[320px] overflow-auto rounded-3xl border border-white/10 bg-black/25 p-5 text-xs leading-6 text-muted-foreground">
            <code>{JSON.stringify(result.analysis, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
