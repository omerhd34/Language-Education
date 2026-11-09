import type { ReadingLevel } from "@/data/readings/types";

export type ReadingWordLookupResult = {
  lemma: string;
  display: string;
  tr: string;
  level?: ReadingLevel;
  fromGlossary: true;
};
