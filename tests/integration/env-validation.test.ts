import { describe, expect, it } from "vitest";

import { validateRuntimeEnv } from "@/config/env-validation";

describe("environment validation", () => {
  it("allows development with optional secrets", () => {
    const result = validateRuntimeEnv({ NODE_ENV: "development" } as NodeJS.ProcessEnv);
    expect(result.ok).toBe(true);
  });

  it("requires production secrets", () => {
    const result = validateRuntimeEnv({ NODE_ENV: "production" } as NodeJS.ProcessEnv);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join("\n")).toContain("NEXTAUTH_SECRET");
  });
});
