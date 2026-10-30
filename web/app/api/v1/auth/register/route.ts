import {
  handleRouteError,
  jsonSuccess,
} from "@/lib/server/apiResponse";
import { setRefreshCookie } from "@/lib/server/auth/cookies";
import { registerUser } from "@/lib/server/auth/service";
import { registerSchema } from "@/validators/auth.schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = registerSchema.parse(body);
    const result = await registerUser(input);

    const response = jsonSuccess(
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      201,
    );

    setRefreshCookie(response, result.refreshToken);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
