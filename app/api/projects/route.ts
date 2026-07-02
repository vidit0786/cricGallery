import { NextResponse } from "next/server";

import { handleCreateProject, handleListProjects } from "@/server/controllers/project-controller";
import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertJsonRequest, assertSameOrigin } from "@/server/security/request-guards";
import { toErrorResponse } from "@/utils/api-errors";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    rateLimitRequest(request, "projects-list", 120, 60_000, user.id);
    return NextResponse.json(await handleListProjects(user.id));
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const user = await requireUser();
    rateLimitRequest(request, "projects-create", 30, 60_000, user.id);
    return NextResponse.json(await handleCreateProject(user.id, await request.json()), { status: 201 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
