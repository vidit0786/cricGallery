import { NextResponse } from "next/server";

import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { handleDuplicateImage } from "@/server/controllers/image-controller";
import { assertSameOrigin } from "@/server/security/request-guards";
import { toErrorResponse } from "@/utils/api-errors";

interface RouteContext {
  params: Promise<{ imageId: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    assertSameOrigin(_request);
    const user = await requireUser();
    rateLimitRequest(_request, "images-duplicate", 30, 60_000, user.id);
    const { imageId } = await context.params;
    return NextResponse.json(await handleDuplicateImage(user.id, imageId), { status: 201 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
