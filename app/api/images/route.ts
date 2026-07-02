import { NextResponse } from "next/server";

import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { handleListImages } from "@/server/controllers/image-controller";
import { toErrorResponse } from "@/utils/api-errors";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    rateLimitRequest(request, "images-list", 120, 60_000, user.id);
    const { searchParams } = new URL(request.url);
    return NextResponse.json(await handleListImages(user.id, searchParams));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
