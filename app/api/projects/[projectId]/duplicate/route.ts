import { NextResponse } from "next/server";

import { handleDuplicateProject } from "@/server/controllers/project-controller";
import { requireUser } from "@/server/auth/session";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertSameOrigin } from "@/server/security/request-guards";
import { toErrorResponse } from "@/utils/api-errors";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    assertSameOrigin(_request);
    const user = await requireUser();
    rateLimitRequest(_request, "projects-duplicate", 30, 60_000, user.id);
    const { projectId } = await context.params;
    return NextResponse.json(await handleDuplicateProject(user.id, projectId), { status: 201 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
