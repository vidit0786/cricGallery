import { Check } from "lucide-react";

import { ProgressBar } from "@/components/studio/progress-bar";
import { cn } from "@/lib/utils";

interface WizardStep {
  id: string;
  title: string;
}

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
}

/** Premium visual progress indicator for the studio customization wizard. */
export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="rounded-3xl border border-white/10 bg-card/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Step {currentStep + 1} of {steps.length}
          </p>
          <h2 className="mt-1 text-xl font-black text-foreground">{steps[currentStep]?.title}</h2>
        </div>
        <div className="hidden rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-bold text-primary sm:block">
          {Math.round(progressPercent)}% complete
        </div>
      </div>

      <ProgressBar value={progressPercent} className="mt-5" />

      <ol className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9" aria-label="Wizard progress">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className="min-w-0">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-2xl border px-2.5 py-2 text-xs font-semibold transition-all duration-300",
                  isCurrent && "border-primary bg-primary/15 text-primary shadow-[0_0_24px_rgba(183,249,90,0.14)]",
                  isComplete && "border-primary/25 bg-primary/10 text-foreground",
                  !isCurrent && !isComplete && "border-white/10 bg-white/[0.03] text-muted-foreground",
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-black",
                    isComplete ? "bg-primary text-primary-foreground" : "bg-white/10 text-current",
                    isCurrent && "bg-primary text-primary-foreground",
                  )}
                >
                  {isComplete ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                </span>
                <span className="truncate">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
