export type ApiErrorCode =
  | "CONFIGURATION_ERROR"
  | "INVALID_IMAGE"
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "AI_SERVICE_ERROR"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export class AppError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(message: string, status = 500, code: ApiErrorCode = "UNKNOWN_ERROR", details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function mapOpenAIStatus(status: number) {
  if (status === 400) {
    return new AppError(
      "The uploaded image or prompt could not be processed. Please try another clear JPG, PNG, or WEBP image.",
      400,
      "INVALID_IMAGE",
    );
  }

  if (status === 401 || status === 403) {
    return new AppError(
      "The AI service is not configured correctly. Please check the server API key.",
      500,
      "CONFIGURATION_ERROR",
    );
  }

  if (status === 408 || status === 504) {
    return new AppError("The AI service timed out. Please try again.", 504, "TIMEOUT");
  }

  if (status === 429) {
    return new AppError(
      "The AI service is currently rate limited. Please wait a moment and try again.",
      429,
      "RATE_LIMITED",
    );
  }

  return new AppError(
    "The AI service could not complete the request. Please try again shortly.",
    502,
    "AI_SERVICE_ERROR",
  );
}

export function toErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message,
        },
      },
    };
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return {
      status: 504,
      body: {
        error: {
          code: "TIMEOUT" satisfies ApiErrorCode,
          message: "The AI request timed out. Please try again.",
        },
      },
    };
  }

  return {
    status: 500,
    body: {
      error: {
        code: "UNKNOWN_ERROR" satisfies ApiErrorCode,
        message: "Something went wrong while generating the cricket image. Please try again.",
      },
    },
  };
}
