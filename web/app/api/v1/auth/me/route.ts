import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { getCurrentUser, updateProfile } from "@/lib/server/auth/service";
import { updateProfileSchema } from "@/validators/auth.schema";

export async function GET(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const user = await getCurrentUser(payload.sub);
    return jsonSuccess({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const body: unknown = await request.json();
    const input = updateProfileSchema.parse(body);
    const user = await updateProfile(payload.sub, input);
    return jsonSuccess({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
