import type { NextResponse } from "next/server";
import {
  serializeSessionHint,
  SESSION_HINT_COOKIE,
  SESSION_HINT_MAX_AGE,
  type SessionHint,
} from "@/lib/sessionHint";
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

export function setSessionHintCookie(
  response: NextResponse,
  user: SessionHint,
): void {
  const env = getServerEnv();

  response.cookies.set(SESSION_HINT_COOKIE, serializeSessionHint(user), {
    httpOnly: false,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HINT_MAX_AGE,
  });
}

export function clearSessionHintCookie(response: NextResponse): void {
  const env = getServerEnv();

  response.cookies.set(SESSION_HINT_COOKIE, "", {
    httpOnly: false,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
