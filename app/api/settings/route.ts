import { NextResponse } from "next/server";

import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { handleGetSettings, handleUpdateSettings } from "@/server/controllers/settings-controller";
import { assertJsonRequest, assertSameOrigin } from "@/server/security/request-guards";
import { toErrorResponse } from "@/utils/api-errors";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    rateLimitRequest(request, "settings-get", 120, 60_000, user.id);
    return NextResponse.json(await handleGetSettings(user.id));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const user = await requireUser();
    rateLimitRequest(request, "settings-update", 30, 60_000, user.id);
    return NextResponse.json(await handleUpdateSettings(user.id, await request.json()));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
