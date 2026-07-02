"use client";

import Image from "next/image";
import { useState } from "react";
import { Award, GitCompare, Lightbulb, Sparkles } from "lucide-react";

import { BeforeAfterCompare } from "@/components/studio/before-after-compare";
import { GalleryManagerPanel } from "@/components/studio/gallery-manager-panel";
import { Button } from "@/components/ui/button";
import type { CreativeDirectorResult, CreativeGenerationVersion, ImprovementSuggestion } from "@/types/creative-director";
import type { ImageVariationMode } from "@/types/ai";

interface CreativeDirectorPanelProps {
  originalImageUrl: string;
  result: CreativeDirectorResult;
  onImprove: (mode: ImageVariationMode) => void;
  isGenerating?: boolean;
}

function ScorePill({ score }: { score: number }) {
  return <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">Score {score}</span>;
}

function VersionCard({ version, selected, onSelect }: { version: CreativeGenerationVersion; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group rounded-3xl border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${selected ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(183,249,90,0.15)]" : "border-white/10 bg-white/[0.04] hover:border-primary/35"}`}
      aria-label={`Select generation rank ${version.rank}, ${version.strategy.name}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/30">
        <Image src={version.generatedImage.dataUrl} alt={version.strategy.name} fill sizes="240px" className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized loading="lazy" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-sm font-black text-foreground">#{version.rank} {version.strategy.name}</p>
        <ScorePill score={version.scores.overall} />
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{version.strategy.reason}</p>
    </button>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">{title}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export function CreativeDirectorPanel({ originalImageUrl, result, onImprove, isGenerating = false }: CreativeDirectorPanelProps) {
  const [selectedId, setSelectedId] = useState(result.recommendedImage.versionId);
  const selected = result.versions.find((version) => version.id === selectedId) ?? result.versions[0];
  const [compareId, setCompareId] = useState(result.versions.find((version) => version.id !== selected.id)?.id ?? selected.id);
  const compare = result.versions.find((version) => version.id === compareId) ?? selected;

  const suggestions: ImprovementSuggestion[] = selected.feedback.suggestions;

  return (
    <section className="grid gap-6" aria-label="AI Creative Director results">
      <div className="rounded-3xl border border-primary/25 bg-primary/[0.08] p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary-foreground">
              <Award className="size-4" aria-hidden="true" /> Recommended Image
            </p>
            <h2 className="mt-3 text-2xl font-black text-foreground">#{result.recommendedImage.rank} · Score {result.recommendedImage.score}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">{result.recommendedImage.reason}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Provider:</strong> {result.insights.providerUsed}</p>
            <p><strong className="text-foreground">Prompt:</strong> {result.insights.promptVersion}</p>
            <p><strong className="text-foreground">Avg time:</strong> {(result.insights.averageGenerationTimeMs / 1000).toFixed(1)}s</p>
            <p><strong className="text-foreground">Strategies:</strong> {result.insights.creativeStrategySummary}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {result.versions.map((version) => (
          <VersionCard key={version.id} version={version} selected={version.id === selected.id} onSelect={() => setSelectedId(version.id)} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <BeforeAfterCompare beforeSrc={originalImageUrl} afterSrc={selected.generatedImage.dataUrl} beforeAlt="Original uploaded image" afterAlt="Selected generated image" />
        <div className="grid gap-4">
          <FeedbackList title="Strengths" items={selected.feedback.strengths} />
          <FeedbackList title="Weaknesses" items={selected.feedback.weaknesses} />
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><Lightbulb className="size-4" /> Smart Improvements</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button key={suggestion.id} type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove(suggestion.variationMode)} title={suggestion.description}>
                  <Sparkles aria-hidden="true" /> {suggestion.label}
                </Button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Estimated improvement potential: {selected.feedback.estimatedImprovementPotential}%</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Smart Shortcuts</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove("more_like_this")}>Generate More Like This</Button>
              <Button type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove("more_cinematic")}>Create Poster Version</Button>
              <Button type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove("different_camera_angle")}>Create Wallpaper Version</Button>
              <Button type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove("more_realistic")}>Create Social Media Version</Button>
              <Button type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove("more_dramatic")}>Create World Cup Version</Button>
              <Button type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove("more_cinematic")}>Create IPL Final Version</Button>
              <Button type="button" variant="outline" size="sm" disabled={isGenerating} onClick={() => onImprove("improve_realism")}>Create Training Version</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-primary"><GitCompare className="size-4" /> Generation Timeline & Compare</p>
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <select value={compareId} onChange={(event) => setCompareId(event.target.value)} className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground" aria-label="Select generation to compare">
            {result.timeline.map((item) => <option key={item.id} value={item.id} className="bg-card text-foreground">{item.label} · #{item.rank} · {item.strategyName}</option>)}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/30"><Image src={selected.generatedImage.dataUrl} alt="Selected generation" fill sizes="360px" className="object-cover" unoptimized loading="lazy" /></div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/30"><Image src={compare.generatedImage.dataUrl} alt="Compared generation" fill sizes="360px" className="object-cover" unoptimized loading="lazy" /></div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">Favorite / Manage Selected Generation</p>
        <GalleryManagerPanel imageId={selected.savedImageId} />
      </div>
    </section>
  );
}
