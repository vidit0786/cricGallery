import { NextResponse } from "next/server";
import { z } from "zod";

import { monitoring } from "@/server/observability/monitoring";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertJsonRequest, assertSameOrigin } from "@/server/security/request-guards";
import { AppError, toErrorResponse } from "@/utils/api-errors";

const clientEventSchema = z.object({
  name: z.string().min(1).max(120),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    rateLimitRequest(request, "monitoring-events", 60, 60_000);

    const parsed = clientEventSchema.safeParse(await request.json());
    if (!parsed.success) throw new AppError("Invalid monitoring event.", 400, "INVALID_REQUEST");

    monitoring.captureEvent({ name: parsed.data.name, properties: parsed.data.properties });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
