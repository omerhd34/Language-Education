import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { resetUserProgress } from "@/lib/server/progress/resetService";
import { progressResetSchema } from "@/validators/progress.schema";

export async function POST(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const body: unknown = await request.json();
    const input = progressResetSchema.parse(body);

    const data = await resetUserProgress(payload.sub, input.scope);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
