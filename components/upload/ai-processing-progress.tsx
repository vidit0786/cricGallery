import { CheckCircle2, Loader2, WandSparkles } from "lucide-react";

import { Skeleton } from "@/components/studio/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ProcessingStage = "analyzing" | "prompt" | "generating";

const stages: Array<{ id: ProcessingStage; label: string; description: string }> = [
  {
    id: "analyzing",
    label: "Analyzing image...",
    description: "Extracting visible facial, lighting, pose, clothing, and camera details.",
  },
  {
    id: "prompt",
    label: "Building prompt...",
    description: "Merging image analysis with cricket selections into a professional prompt.",
  },
  {
    id: "generating",
    label: "Generating cricket image...",
    description: "Creating the realistic cricket scene with the configured image provider.",
  },
];

interface AiProcessingProgressProps {
  currentStage: ProcessingStage;
}

/** User-facing progress UI while the server runs the AI workflow. */
export function AiProcessingProgress({ currentStage }: AiProcessingProgressProps) {
  const currentIndex = stages.findIndex((stage) => stage.id === currentStage);

  return (
    <Card className="border-primary/30 bg-primary/[0.06]">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <WandSparkles className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">AI workflow running</p>
            <h3 className="mt-1 text-xl font-black text-foreground">Please keep this tab open</h3>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-3" aria-hidden="true">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>

        <div className="grid gap-3">
          {stages.map((stage, index) => {
            const isComplete = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <div
                key={stage.id}
                className={cn(
                  "flex gap-4 rounded-3xl border p-4 transition-all duration-300",
                  isActive && "border-primary bg-primary/10 text-foreground",
                  isComplete && "border-primary/25 bg-white/[0.04] text-foreground",
                  !isActive && !isComplete && "border-white/10 bg-white/[0.03] text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full",
                    isActive && "bg-primary text-primary-foreground",
                    isComplete && "bg-primary/20 text-primary",
                    !isActive && !isComplete && "bg-white/10 text-muted-foreground",
                  )}
                >
                  {isActive ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  ) : isComplete ? (
                    <CheckCircle2 className="size-5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div>
                  <p className="font-bold">{stage.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
