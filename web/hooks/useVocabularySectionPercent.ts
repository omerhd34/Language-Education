"use client";

import { useEffect, useState } from "react";
import type { VocabularyCategory } from "@/data/vocabulary";
import { EXERCISE_DRAFT_EVENT } from "@/lib/exerciseDraftStorage";
import { VOCABULARY_ACTIVITY_EVENT } from "@/lib/vocabularyActivityStorage";
import { vocabularySectionPercent } from "@/lib/vocabularySectionProgress";

export function useVocabularySectionPercent(
  category: VocabularyCategory,
  knownWordIds: ReadonlySet<string>,
): number {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function refresh() {
      setPercent(vocabularySectionPercent(category, knownWordIds));
    }

    refresh();
    window.addEventListener(VOCABULARY_ACTIVITY_EVENT, refresh);
    window.addEventListener(EXERCISE_DRAFT_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(VOCABULARY_ACTIVITY_EVENT, refresh);
      window.removeEventListener(EXERCISE_DRAFT_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [category, knownWordIds]);

  return percent;
}
