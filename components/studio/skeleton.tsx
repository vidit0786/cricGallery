import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Reusable shimmer skeleton for premium loading placeholders. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/[0.06] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className,
      )}
    />
  );
}
