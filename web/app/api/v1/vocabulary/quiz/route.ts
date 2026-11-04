import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { getVocabularyQuizForUser } from "@/lib/server/vocabulary/quizService";

export async function GET(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const data = await getVocabularyQuizForUser(payload.sub);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
