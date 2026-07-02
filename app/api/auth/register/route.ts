import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/database/prisma";
import { rateLimitRequest } from "@/server/security/rate-limit";
import { assertJsonRequest, assertSameOrigin } from "@/server/security/request-guards";
import { AppError, toErrorResponse } from "@/utils/api-errors";
import { sanitizeText } from "@/utils/sanitize";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address.").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    rateLimitRequest(request, "auth-register", 5, 60_000);
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid registration details.", 400, "INVALID_REQUEST");
    }

    const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existingUser) {
      throw new AppError("An account already exists for this email address.", 409, "INVALID_REQUEST");
    }

    const user = await prisma.user.create({
      data: {
        name: sanitizeText(parsed.data.name, 80),
        email: parsed.data.email,
        passwordHash: await hash(parsed.data.password, 12),
        settings: { create: {} },
        projects: {
          create: {
            name: "My Cricket Studio Project",
            description: "Default project for generated cricket images.",
            isFavorite: true,
          },
        },
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
