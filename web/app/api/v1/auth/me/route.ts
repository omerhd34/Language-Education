import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { getCurrentUser } from "@/lib/server/auth/service";

export async function GET(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const user = await getCurrentUser(payload.sub);
    return jsonSuccess({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
