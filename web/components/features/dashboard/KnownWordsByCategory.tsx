"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import type { KnownVocabularyWord } from "@/store/api";
import { KnownWordRow } from "@/components/features/dashboard/KnownWordRow";
import { cn } from "@/lib/utils";

type KnownWordsByCategoryProps = {
  words: KnownVocabularyWord[];
};

type CategoryGroup = {
  categoryId: string;
  categoryTitle: string;
  words: KnownVocabularyWord[];
};

export function KnownWordsByCategory({ words }: KnownWordsByCategoryProps) {
  const t = useTranslations("Dashboard");

  const groups = useMemo(() => {
    const map = new Map<string, CategoryGroup>();
    for (const word of words) {
      const existing = map.get(word.categoryId);
      if (existing) {
        existing.words.push(word);
        continue;
      }
      map.set(word.categoryId, {
        categoryId: word.categoryId,
        categoryTitle: word.categoryTitle,
        words: [word],
      });
    }
    return [...map.values()].sort((a, b) =>
      a.categoryTitle.localeCompare(b.categoryTitle, "tr"),
    );
  }, [words]);

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  return (
    <ul className="space-y-2" aria-label={t("knownWordsListAria")}>
      {groups.map((group) => {
        const isOpen = openCategoryId === group.categoryId;

        return (
          <li key={group.categoryId}>
            <div className="overflow-hidden rounded-2xl border border-brand-200/80 dark:border-brand-800/70">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  setOpenCategoryId((current) =>
                    current === group.categoryId ? null : group.categoryId,
                  );
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors",
                  "bg-brand-50/70 hover:bg-brand-100/60 dark:bg-brand-950/40 dark:hover:bg-brand-900/50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                )}
              >
                <span className="min-w-0">
                  <span className="block font-display text-base font-semibold text-brand-950 dark:text-brand-100">
                    {group.categoryTitle}
                  </span>
                  <span className="mt-0.5 block text-xs text-brand-500 dark:text-brand-400">
                    {t("knownWordsCategoryCount", {
                      count: group.words.length,
                    })}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-brand-500 transition-transform dark:text-brand-400",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

              {isOpen ? (
                <ul className="space-y-2 border-t border-brand-200/70 bg-background/40 p-3 dark:border-brand-800/60">
                  {group.words.map((word) => (
                    <li key={word.id}>
                      <KnownWordRow word={word} compact />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
