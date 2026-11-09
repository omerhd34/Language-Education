import type { ReadingWordGlossary } from "@/data/readings/types";

export function mergeReadingGlossaries(
  ...parts: Array<ReadingWordGlossary | undefined>
): ReadingWordGlossary | undefined {
  const merged: ReadingWordGlossary = {};
  let hasEntries = false;

  for (const part of parts) {
    if (!part) {
      continue;
    }
    Object.assign(merged, part);
    hasEntries = true;
  }

  return hasEntries ? merged : undefined;
}
