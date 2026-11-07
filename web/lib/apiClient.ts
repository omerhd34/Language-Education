import type { ApiResponse } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/api";

export class ApiClientError extends Error {
  readonly code?: string;
  readonly details?: unknown;
  readonly status: number;

  constructor(
    message: string,
    options?: { code?: string; details?: unknown; status?: number },
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = options?.code;
    this.details = options?.details;
    this.status = options?.status ?? 0;
  }
}

export function getApiErrorCode(error: unknown): string | null {
  if (error instanceof ApiClientError && error.code) {
    return error.code;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data?: { error?: { code?: string } } }).data?.error
      ?.code === "string"
  ) {
    return (error as { data: { error: { code: string } } }).data.error.code;
  }

  return null;
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  accessToken?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, accessToken } = options;
  const headers = new Headers();

  if (body !== undefined) {
    headers.set("content-type", "application/json");
  }

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiClientError("Invalid JSON response", {
      status: response.status,
    });
  }

  if (!payload.success) {
    throw new ApiClientError(payload.error.message, {
      code: payload.error.code,
      details: payload.error.details,
      status: response.status,
    });
  }

  return payload.data;
}
