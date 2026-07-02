import { AppError } from "@/utils/api-errors";

export function assertSameOrigin(request: Request) {
  const method = request.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return;

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return;

  const originHost = new URL(origin).host;
  if (originHost !== host) {
    throw new AppError("Invalid request origin.", 403, "INVALID_REQUEST");
  }
}

export function assertJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new AppError("Expected application/json request body.", 415, "INVALID_REQUEST");
  }
}
