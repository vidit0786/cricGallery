import { NextResponse } from "next/server";

import { validateRuntimeEnv } from "@/config/env-validation";

export async function GET() {
  const env = validateRuntimeEnv();

  return NextResponse.json(
    {
      status: env.ok ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      service: "cricket-ai-studio",
      checks: {
        environment: env.ok ? "ok" : "invalid",
      },
      errors: env.ok ? undefined : env.errors,
    },
    {
      status: env.ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
