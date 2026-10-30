import {
  handleRouteError,
  jsonSuccess,
} from "@/lib/server/apiResponse";
import { setRefreshCookie } from "@/lib/server/auth/cookies";
import { verifyEmail } from "@/lib/server/auth/service";
import { verifyEmailSchema } from "@/validators/auth.schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const input = verifyEmailSchema.parse(body);
    const result = await verifyEmail(input);

    const response = jsonSuccess({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    setRefreshCookie(response, result.refreshToken);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
