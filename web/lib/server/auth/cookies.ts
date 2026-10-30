import type { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/server/env";

export const REFRESH_COOKIE_NAME = "refreshToken";

const COOKIE_PATH = "/api/v1/auth";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function setRefreshCookie(response: NextResponse, refreshToken: string): void {
  const env = getServerEnv();

  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearRefreshCookie(response: NextResponse): void {
  const env = getServerEnv();

  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: 0,
  });
}
