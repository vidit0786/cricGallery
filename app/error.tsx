"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("app_error_boundary", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <section className="page-section grid min-h-[60vh] place-items-center py-16">
      <div className="max-w-xl rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <AlertTriangle className="mx-auto size-12 text-destructive" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black text-foreground">Something went wrong</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          The studio hit an unexpected error. Please retry, and if the issue continues, check your environment and service logs.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          <RefreshCw aria-hidden="true" /> Try again
        </Button>
      </div>
    </section>
  );
}
