"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromptResultProps {
  prompt: string;
}

/** Scrollable prompt display with local clipboard copy support. */
export function PromptResult({ prompt }: PromptResultProps) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card className="border-primary/30 bg-primary/[0.06]">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="size-4" aria-hidden="true" /> Local prompt generated
          </p>
          <CardTitle>Structured Cricket Prompt</CardTitle>
        </div>
        <Button type="button" onClick={copyPrompt} variant={copied ? "secondary" : "default"}>
          {copied ? <CheckCircle2 aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy Prompt"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[420px] overflow-auto rounded-3xl border border-white/10 bg-black/35 p-5 text-sm leading-7 text-primary/95 shadow-inner">
          <code>{prompt}</code>
        </pre>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          This text was generated locally from your selections. No AI model, backend, database, or
          external API was used.
        </p>
      </CardContent>
    </Card>
  );
}
