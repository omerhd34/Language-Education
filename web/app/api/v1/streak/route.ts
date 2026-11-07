import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import {
  getStreakForUser,
  recordStreakActivity,
} from "@/lib/server/streak/service";

export async function GET(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const data = await getStreakForUser(payload.sub);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const data = await recordStreakActivity(payload.sub);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
