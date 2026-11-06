import {
  handleRouteError,
  jsonSuccess,
} from "@/lib/server/apiResponse";
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

    await logoutUser(refreshToken);

    const response = jsonSuccess({ message: "Logged out" });
    clearRefreshCookie(response);
    clearSessionHintCookie(response);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
