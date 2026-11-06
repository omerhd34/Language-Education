"use client";

import { useEffect, useState } from "react";
import {
  VOCABULARY_ACTIVITY_EVENT,
  readVocabularyActivityIds,
} from "@/lib/vocabularyActivityStorage";

export function useVocabularyActivityIds(
  categoryId: string,
): ReadonlySet<string> {
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    function refresh() {
      setIds(new Set(readVocabularyActivityIds(categoryId)));
    }

    refresh();
    window.addEventListener(VOCABULARY_ACTIVITY_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(VOCABULARY_ACTIVITY_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [categoryId]);

  return ids;
}
