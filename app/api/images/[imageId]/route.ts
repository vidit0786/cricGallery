import { NextResponse } from "next/server";

import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { handleDeleteImage, handleGetImage, handleUpdateImage } from "@/server/controllers/image-controller";
import { assertJsonRequest, assertSameOrigin } from "@/server/security/request-guards";
import { toErrorResponse } from "@/utils/api-errors";

interface RouteContext {
  params: Promise<{ imageId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    rateLimitRequest(_request, "images-get", 120, 60_000, user.id);
    const { imageId } = await context.params;
    return NextResponse.json(await handleGetImage(user.id, imageId));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const user = await requireUser();
    rateLimitRequest(request, "images-update", 60, 60_000, user.id);
    const { imageId } = await context.params;
    return NextResponse.json(await handleUpdateImage(user.id, imageId, await request.json()));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    assertSameOrigin(_request);
    const user = await requireUser();
    rateLimitRequest(_request, "images-delete", 30, 60_000, user.id);
    const { imageId } = await context.params;
    return NextResponse.json(await handleDeleteImage(user.id, imageId));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
