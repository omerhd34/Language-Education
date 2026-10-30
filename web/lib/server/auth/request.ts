import { cookies } from "next/headers";
import { AppError } from "@/lib/server/AppError";
import { verifyAccessToken, type AccessTokenPayload } from "@/lib/server/jwt";
import { REFRESH_COOKIE_NAME } from "@/lib/server/auth/cookies";

export async function getRefreshTokenFromRequest(
  bodyToken?: string,
): Promise<string | undefined> {
  if (bodyToken) {
    return bodyToken;
  }

  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
}

export function getAccessTokenPayload(request: Request): AccessTokenPayload {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401, "UNAUTHORIZED");
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    return verifyAccessToken(token);
  } catch {
    throw new AppError("Invalid or expired access token", 401, "UNAUTHORIZED");
  }
}
