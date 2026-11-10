import type { EnglishVerb } from "@/data/vocabulary/verbs";

export type VerbTableSortKey = "default" | "infinitive" | "type";

export type VerbListFilter = "all" | "regular" | "irregular";

function compareInfinitive(a: EnglishVerb, b: EnglishVerb): number {
  return a.infinitive.localeCompare(b.infinitive, "en", {
    sensitivity: "base",
  });
}

export function applyVerbTableSort(
  verbs: readonly EnglishVerb[],
  sortKey: VerbTableSortKey,
  listFilter: VerbListFilter,
  infinitiveDescending: boolean,
): EnglishVerb[] {
  const items = [...verbs];

  if (sortKey === "infinitive") {
    return items.sort((a, b) => {
      const cmp = compareInfinitive(a, b);
      return infinitiveDescending ? -cmp : cmp;
    });
  }

  if (sortKey === "type" && listFilter === "all") {
    return items.sort((a, b) => {
      if (a.regular !== b.regular) {
        return a.regular ? 1 : -1;
      }
      return compareInfinitive(a, b);
    });
  }

  return items.sort((a, b) => {
    if (listFilter === "all" && a.regular !== b.regular) {
      return a.regular ? -1 : 1;
    }
    return compareInfinitive(a, b);
  });
}
