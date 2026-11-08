import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import {
  clearRefreshCookie,
  clearSessionHintCookie,
} from "@/lib/server/auth/cookies";
import { getRefreshTokenFromRequest } from "@/lib/server/auth/request";
import { logoutUser } from "@/lib/server/auth/service";
import { refreshSchema } from "@/validators/auth.schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => ({}));
    const input = refreshSchema.parse(body);
    const refreshToken = await getRefreshTokenFromRequest(input.refreshToken);

    try {
      await logoutUser(refreshToken);
    } catch (error) {
      console.error("Logout token revocation failed:", error);
    }

    const response = jsonSuccess({ message: "Logged out" });
    clearRefreshCookie(response);
    clearSessionHintCookie(response);
    return response;
  } catch (error) {
    const response = handleRouteError(error);
    clearRefreshCookie(response);
    clearSessionHintCookie(response);
    return response;
  }
}
