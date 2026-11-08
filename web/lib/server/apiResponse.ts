import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/server/AppError";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  error: null;
};

export type ApiFailure = {
  success: false;
  data: null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
};

export function jsonSuccess<T>(data: T, status = 200): NextResponse {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    error: null,
  };
  return NextResponse.json(body, { status });
}

export function jsonError(
  status: number,
  message: string,
  code?: string,
  details?: unknown,
): NextResponse {
  const body: ApiFailure = {
    success: false,
    data: null,
    error: {
      message,
      ...(code ? { code } : {}),
      ...(details !== undefined ? { details } : {}),
    },
  };
  return NextResponse.json(body, { status });
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return jsonError(error.statusCode, error.message, error.code, error.details);
  }

  if (error instanceof ZodError) {
    return jsonError(
      400,
      "Validation failed",
      "VALIDATION_ERROR",
      error.flatten(),
    );
  }

  const causeChain: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (current instanceof Error) {
      causeChain.push(current.message);
      current = current.cause;
      continue;
    }
    break;
  }
  console.error("Unhandled route error:", causeChain.join(" | ") || error);

  return jsonError(500, "Internal server error", "INTERNAL_ERROR");
}
