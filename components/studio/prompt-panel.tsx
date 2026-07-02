"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Download, GitCompare, Sparkles, TerminalSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PromptPipelineResult } from "@/types/prompt-pipeline";

interface PromptPanelProps {
  prompt: string;
  title?: string;
  details?: PromptPipelineResult;
}

/** Scrollable premium prompt panel with copy, download, compare and prompt detail actions. */
export function PromptPanel({ prompt, title = "Prompt Preview", details }: PromptPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadPrompt = () => {
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cricket-ai-prompt-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const originalChoices = details ? JSON.stringify(details.originalUserChoices, null, 2) : "No prompt details available.";
  const optimizationSummary = details
    ? details.optimizations.map((optimization) => `• ${optimization.title}: ${optimization.after}\n  Why: ${optimization.reason}`).join("\n\n")
    : "No optimization details available.";

  return (
    <Card className="overflow-hidden border-primary/20 bg-[#07130e]/80">
      <CardHeader className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <TerminalSquare className="size-5 text-primary" aria-hidden="true" /> {title}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {details ? (
            <Button type="button" variant="outline" onClick={() => setShowDetails((value) => !value)}>
              <Sparkles aria-hidden="true" /> View Prompt Details
            </Button>
          ) : null}
          {details ? (
            <Button type="button" variant="outline" onClick={() => setShowComparison((value) => !value)}>
              <GitCompare aria-hidden="true" /> Compare Versions
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={downloadPrompt}>
            <Download aria-hidden="true" /> Download
          </Button>
          <Button type="button" onClick={copyPrompt} variant={copied ? "secondary" : "outline"}>
            {copied ? <CheckCircle2 aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {showDetails ? (
          <div className="grid gap-4 border-b border-white/10 p-5">
            <div className="rounded-3xl border border-primary/20 bg-primary/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">AI Optimizations Applied</p>
              <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-sm leading-7 text-foreground">{optimizationSummary}</pre>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Recommendation Summary</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{details?.recommendations.summary}</p>
            </div>
          </div>
        ) : null}

        {showComparison ? (
          <div className="grid gap-4 border-b border-white/10 p-5 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-primary">Original User Choices</p>
              <pre className="max-h-80 overflow-auto rounded-3xl border border-white/10 bg-black/25 p-4 text-xs leading-6 text-muted-foreground">{originalChoices}</pre>
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-primary">Final Optimized Prompt</p>
              <pre className="max-h-80 overflow-auto rounded-3xl border border-white/10 bg-black/25 p-4 text-xs leading-6 text-primary/90">{prompt}</pre>
            </div>
          </div>
        ) : null}

        <pre className="max-h-[420px] overflow-auto p-5 text-sm leading-7 text-primary/95">
          <code>{prompt}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
