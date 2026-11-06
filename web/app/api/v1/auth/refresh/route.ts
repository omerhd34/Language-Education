import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import {
  setRefreshCookie,
  setSessionHintCookie,
} from "@/lib/server/auth/cookies";
import { getRefreshTokenFromRequest } from "@/lib/server/auth/request";
import { refreshSession } from "@/lib/server/auth/service";
import { refreshSchema } from "@/validators/auth.schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => ({}));
    const input = refreshSchema.parse(body);
    const refreshToken = await getRefreshTokenFromRequest(input.refreshToken);
    const result = await refreshSession(refreshToken);

    const response = jsonSuccess({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    setRefreshCookie(response, result.refreshToken);
    setSessionHintCookie(response, result.user);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
