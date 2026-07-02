import { describe, expect, it } from "vitest";

import { checkRateLimit } from "@/server/security/rate-limit";
import { assertSameOrigin } from "@/server/security/request-guards";
import { sanitizeText } from "@/utils/sanitize";

describe("security helpers", () => {
  it("sanitizes dangerous text characters", () => {
    expect(sanitizeText("<script>alert(1)</script>")).toBe("scriptalert(1)/script");
  });

  it("rejects cross-origin mutating requests", () => {
    const request = new Request("https://studio.example/api/projects", {
      method: "POST",
      headers: { origin: "https://evil.example", host: "studio.example" },
    });

    expect(() => assertSameOrigin(request)).toThrow("Invalid request origin");
  });

  it("rate limits repeated requests", () => {
    const key = `test-${Date.now()}`;
    checkRateLimit({ key, limit: 1, windowMs: 1000 });
    expect(() => checkRateLimit({ key, limit: 1, windowMs: 1000 })).toThrow("Too many requests");
  });
});
