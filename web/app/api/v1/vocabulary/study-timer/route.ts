import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { startVocabularyStudyTimer } from "@/lib/server/vocabulary/service";

export async function POST(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const data = await startVocabularyStudyTimer(payload.sub);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
