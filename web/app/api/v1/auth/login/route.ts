import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import {
  setRefreshCookie,
  setSessionHintCookie,
} from "@/lib/server/auth/cookies";
import { loginUser } from "@/lib/server/auth/service";
import { loginSchema } from "@/validators/auth.schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = loginSchema.parse(body);
    const result = await loginUser(input);

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
