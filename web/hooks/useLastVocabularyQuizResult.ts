"use client";

import { useEffect, useState } from "react";
import {
  QUIZ_RESULT_CHANGED_EVENT,
  readLastVocabularyQuizResult,
  type LastVocabularyQuizResult,
} from "@/lib/vocabularyQuizResultStorage";

export function useLastVocabularyQuizResult() {
  const [result, setResult] = useState<LastVocabularyQuizResult | null>(null);

  useEffect(() => {
    const sync = () => setResult(readLastVocabularyQuizResult());
    sync();
    window.addEventListener(QUIZ_RESULT_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(QUIZ_RESULT_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return result;
}
