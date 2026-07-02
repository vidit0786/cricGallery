import { AppError } from "@/utils/api-errors";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    throw new AppError("Too many requests. Please wait and try again.", 429, "RATE_LIMITED");
  }

  existing.count += 1;
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimitRequest(request: Request, scope: string, limit: number, windowMs: number, userId?: string) {
  const key = `${scope}:${userId ?? getClientIp(request)}`;
  checkRateLimit({ key, limit, windowMs });
}
