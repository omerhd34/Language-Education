import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { changePassword } from "@/lib/server/auth/service";
import { changePasswordSchema } from "@/validators/auth.schema";

export async function POST(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const body: unknown = await request.json();
    const input = changePasswordSchema.parse(body);
    const result = await changePassword(payload.sub, input);
    return jsonSuccess(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
