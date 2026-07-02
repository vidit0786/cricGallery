import { z } from "zod";

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(24).optional(),
  DATABASE_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_VISION_MODEL: z.string().optional(),
  OPENAI_IMAGE_MODEL: z.string().optional(),
  OPENAI_IMAGE_SIZE: z.string().optional(),
  OPENAI_IMAGE_QUALITY: z.string().optional(),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().positive().optional(),
});

const productionRequired = ["NEXTAUTH_URL", "NEXTAUTH_SECRET", "DATABASE_URL", "OPENAI_API_KEY"] as const;

export type RuntimeEnvironment = z.infer<typeof baseSchema>;

export function validateRuntimeEnv(env: NodeJS.ProcessEnv = process.env) {
  const parsed = baseSchema.safeParse(env);

  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    };
  }

  const missing = parsed.data.NODE_ENV === "production"
    ? productionRequired.filter((key) => !env[key])
    : [];

  if (missing.length) {
    return {
      ok: false as const,
      errors: missing.map((key) => `${key} is required in production.`),
    };
  }

  return { ok: true as const, data: parsed.data };
}

export function assertRuntimeEnv(env: NodeJS.ProcessEnv = process.env) {
  const result = validateRuntimeEnv(env);
  if (!result.ok) {
    throw new Error(`Environment validation failed:\n${result.errors.join("\n")}`);
  }

  return result.data;
}
