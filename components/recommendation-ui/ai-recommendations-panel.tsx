"use client";

import { BrainCircuit, CheckCircle2, Loader2, Sparkles, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CricketRecommendationResult, RecommendationGroup } from "@/types/recommendation-types";
import { starsLabel } from "@/services/recommendation-utils/scoring";

interface AiRecommendationsPanelProps {
  recommendation: CricketRecommendationResult | null;
  isLoading: boolean;
  error?: string | null;
  onApply: () => void;
  onRefresh: () => void;
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  return (
    <div className="grid gap-1" aria-label={`Confidence ${confidence}%`}>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${confidence}%` }} />
      </div>
      <span className="text-xs font-bold text-primary">{confidence}%</span>
    </div>
  );
}

function RecommendationGroupCard({ group }: { group: RecommendationGroup }) {
  const best = group.options[0];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{group.title}</p>
          <h3 className="mt-2 text-xl font-black text-foreground">{best.label}</h3>
          <p className="mt-1 text-sm font-bold text-primary" aria-label={`${best.stars} out of 5 stars`}>
            {starsLabel(best.stars)} Best Match
          </p>
        </div>
        <div className="w-20">
          <ConfidenceBar confidence={best.confidence} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{best.reason}</p>
      <div className="mt-4 grid gap-2">
        {group.options.slice(1).map((option, index) => (
          <div key={`${option.label}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/15 px-3 py-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {index + 2}. {option.label}
            </span>
            <span className="text-xs font-bold text-primary">{option.confidence}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dedicated AI recommendation panel shown before image generation. */
export function AiRecommendationsPanel({ recommendation, isLoading, error, onApply, onRefresh }: AiRecommendationsPanelProps) {
  return (
    <Card className="overflow-hidden border-primary/25 bg-primary/[0.05]">
      <CardHeader className="border-b border-white/10 bg-white/[0.03]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-primary">
              <BrainCircuit className="size-4" aria-hidden="true" /> AI Recommendation
            </p>
            <CardTitle className="mt-3 text-2xl">Personalized cricket scene suggestions</CardTitle>
          </div>
          <Button type="button" variant="outline" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <WandSparkles aria-hidden="true" />}
            Analyze Again
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="grid min-h-48 place-items-center rounded-3xl border border-white/10 bg-black/20 p-8 text-center">
            <div>
              <Loader2 className="mx-auto size-10 animate-spin text-primary" aria-hidden="true" />
              <p className="mt-4 font-bold text-foreground">Analyzing uploaded image...</p>
              <p className="mt-2 text-sm text-muted-foreground">Looking for pose, lighting, camera distance, and cricket fit.</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive-foreground">{error}</div>
        ) : recommendation ? (
          <div className="grid gap-5">
            <div className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/25 bg-primary/10 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Overall Confidence</p>
                <h3 className="mt-1 text-3xl font-black text-foreground">{recommendation.overallConfidence}%</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{recommendation.summary}</p>
              </div>
              <Button type="button" size="lg" onClick={onApply}>
                <CheckCircle2 aria-hidden="true" /> Apply Recommendations
              </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {recommendation.groups.map((group) => (
                <RecommendationGroupCard key={group.category} group={group} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-muted-foreground">
            <Sparkles className="mx-auto mb-3 size-8 text-primary" aria-hidden="true" />
            Upload an image to receive AI-powered cricket recommendations before generation.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
