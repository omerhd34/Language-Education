import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { completeVocabularyQuiz } from "@/lib/server/vocabulary/quizService";
import { vocabularyQuizCompleteSchema } from "@/validators/vocabulary.schema";

export async function POST(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const body: unknown = await request.json();
    const input = vocabularyQuizCompleteSchema.parse(body);
    const data = await completeVocabularyQuiz(payload.sub, input.wordIds);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
