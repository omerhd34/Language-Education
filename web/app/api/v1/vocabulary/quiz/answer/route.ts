import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import { answerVocabularyQuizQuestion } from "@/lib/server/vocabulary/quizService";
import { vocabularyQuizAnswerSchema } from "@/validators/vocabulary.schema";

export async function POST(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const body: unknown = await request.json();
    const input = vocabularyQuizAnswerSchema.parse(body);

    const data = await answerVocabularyQuizQuestion(
      payload.sub,
      input.wordId,
      input.answer,
      input.quizType,
    );
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
