import { handleRouteError, jsonSuccess } from "@/lib/server/apiResponse";
import { getAccessTokenPayload } from "@/lib/server/auth/request";
import {
  getVocabularyStatusForUser,
  setVocabularyWordStatus,
} from "@/lib/server/vocabulary/service";
import {
  setVocabularyWordStatusSchema,
  vocabularyStatusQuerySchema,
} from "@/validators/vocabulary.schema";

export async function GET(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const { searchParams } = new URL(request.url);
    const query = vocabularyStatusQuerySchema.parse({
      categoryId: searchParams.get("categoryId") ?? undefined,
    });

    const data = await getVocabularyStatusForUser(
      payload.sub,
      query.categoryId,
    );
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const payload = getAccessTokenPayload(request);
    const body: unknown = await request.json();
    const input = setVocabularyWordStatusSchema.parse(body);

    const data = await setVocabularyWordStatus(
      payload.sub,
      input.wordId,
      input.status,
    );
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
