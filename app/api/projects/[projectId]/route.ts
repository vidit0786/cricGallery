import { NextResponse } from "next/server";

import {
  handleDeleteProject,
  handleGetProject,
  handleUpdateProject,
} from "@/server/controllers/project-controller";
import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertJsonRequest, assertSameOrigin } from "@/server/security/request-guards";
import { toErrorResponse } from "@/utils/api-errors";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = await requireUser();
    rateLimitRequest(_request, "projects-get", 120, 60_000, user.id);
    const { projectId } = await context.params;
    return NextResponse.json(await handleGetProject(user.id, projectId));
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
    rateLimitRequest(request, "projects-update", 60, 60_000, user.id);
    const { projectId } = await context.params;
    return NextResponse.json(await handleUpdateProject(user.id, projectId, await request.json()));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    assertSameOrigin(_request);
    const user = await requireUser();
    rateLimitRequest(_request, "projects-delete", 30, 60_000, user.id);
    const { projectId } = await context.params;
    return NextResponse.json(await handleDeleteProject(user.id, projectId));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
