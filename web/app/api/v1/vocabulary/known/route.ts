import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { getKnownVocabularyWordsForUser } from "@/lib/server/vocabulary/service";

export async function GET(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const data = await getKnownVocabularyWordsForUser(payload.sub);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
