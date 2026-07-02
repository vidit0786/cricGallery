type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, string | number | boolean | null | undefined>;

const sensitiveKeys = new Set(["password", "token", "secret", "apiKey", "authorization", "cookie", "email"]);

function sanitizeMeta(meta: LogMeta = {}) {
  return Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [key, sensitiveKeys.has(key.toLowerCase()) ? "[redacted]" : value]),
  );
}

function write(level: LogLevel, event: string, meta?: LogMeta) {
  const entry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    service: "cricket-ai-studio",
    ...sanitizeMeta(meta),
  };

  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (event: string, meta?: LogMeta) => process.env.NODE_ENV !== "production" && write("debug", event, meta),
  info: (event: string, meta?: LogMeta) => write("info", event, meta),
  warn: (event: string, meta?: LogMeta) => write("warn", event, meta),
  error: (event: string, error?: unknown, meta?: LogMeta) => {
    const errorMeta = error instanceof Error ? { errorName: error.name, errorMessage: error.message } : { errorMessage: "Unknown error" };
    write("error", event, { ...meta, ...errorMeta });
  },
};
