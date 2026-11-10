"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  VocabularyCategoryTabs,
  type VocabularyCategoryTab,
} from "@/components/features/vocabulary/VocabularyCategoryTabs";
import { VerbsTable } from "@/components/features/vocabulary/VerbsTable";
import { TopicExercisesView } from "@/components/features/topics/TopicExercisesView";
import {
  allEnglishVerbs,
  irregularVerbs,
  regularVerbs,
  VERBS_REFERENCE_ID,
} from "@/data/vocabulary/verbs";
import {
  generateVerbExercises,
  type VerbExerciseSessionSeeds,
} from "@/lib/vocabulary/generateVerbExercises";
import type { ExerciseType } from "@/data/topics/types";
import {
  applyVerbTableSort,
  type VerbListFilter,
  type VerbTableSortKey,
} from "@/lib/vocabulary/sortVerbs";
import { vocabularyExerciseProgressKey } from "@/lib/vocabularySectionProgress";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type { VerbListFilter } from "@/lib/vocabulary/sortVerbs";

export function VerbsSection() {
  const t = useTranslations("Vocabulary");
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab: VocabularyCategoryTab =
    searchParams.get("tab") === "exercises" ? "exercises" : "words";

  const filterParam = searchParams.get("filter");
  const listFilter: VerbListFilter =
    filterParam === "regular" || filterParam === "irregular"
      ? filterParam
      : "all";

  const [sortKey, setSortKey] = useState<VerbTableSortKey>("default");
  const [infinitiveDescending, setInfinitiveDescending] = useState(false);

  useEffect(() => {
    setSortKey("default");
    setInfinitiveDescending(false);
  }, [listFilter]);

  function createVerbExerciseSeeds(): VerbExerciseSessionSeeds {
    return {
      multiple_choice: crypto.randomUUID(),
      fill_blank: crypto.randomUUID(),
      listening: crypto.randomUUID(),
      crossword: crypto.randomUUID(),
    };
  }

  const [exerciseSeeds, setExerciseSeeds] = useState(createVerbExerciseSeeds);

  const refreshExerciseSet = useCallback((type?: ExerciseType) => {
    setExerciseSeeds((prev) => {
      if (type) {
        return { ...prev, [type]: crypto.randomUUID() };
      }
      return {
        ...prev,
        multiple_choice: crypto.randomUUID(),
        fill_blank: crypto.randomUUID(),
      };
    });
  }, []);

  const exercises = useMemo(
    () =>
      generateVerbExercises(allEnglishVerbs, VERBS_REFERENCE_ID, exerciseSeeds),
    [exerciseSeeds],
  );

  function handleSortInfinitive() {
    if (sortKey !== "infinitive") {
      setSortKey("infinitive");
      setInfinitiveDescending(true);
      return;
    }
    setInfinitiveDescending((prev) => !prev);
  }

  function handleSortType() {
    if (listFilter !== "all") {
      return;
    }
    setInfinitiveDescending(false);
    setSortKey((prev) => (prev === "type" ? "default" : "type"));
  }

  function handleTabChange(next: VocabularyCategoryTab) {
    if (next === tab) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (next === "exercises") {
      params.set("tab", "exercises");
    } else {
      params.delete("tab");
    }

    const query = params.toString();
    router.replace(
      query ? `/panel/vocabulary/verbs?${query}` : "/panel/vocabulary/verbs",
      { scroll: false },
    );
  }

  function handleFilterChange(next: VerbListFilter) {
    if (next === listFilter) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (next === "all") {
      params.delete("filter");
    } else {
      params.set("filter", next);
    }
    if (tab === "exercises") {
      params.set("tab", "exercises");
    }

    const query = params.toString();
    router.replace(
      query ? `/panel/vocabulary/verbs?${query}` : "/panel/vocabulary/verbs",
      { scroll: false },
    );
  }

  const listVerbs = useMemo(() => {
    const source =
      listFilter === "regular"
        ? regularVerbs
        : listFilter === "irregular"
          ? irregularVerbs
          : allEnglishVerbs;
    return applyVerbTableSort(
      source,
      sortKey,
      listFilter,
      infinitiveDescending,
    );
  }, [listFilter, sortKey, infinitiveDescending]);

  const filterOptions: { id: VerbListFilter; label: string }[] = [
    { id: "all", label: t("verbsFilterAll") },
    { id: "regular", label: t("verbsFilterRegular") },
    { id: "irregular", label: t("verbsFilterIrregular") },
  ];

  return (
    <section aria-labelledby="verbs-heading" className="space-y-6">
      <div>
        <h1 id="verbs-heading" className="page-title">
          {t("verbsTitle")}
        </h1>
        <p className="page-subtitle max-w-3xl">{t("verbsSubtitle")}</p>
      </div>

      <VocabularyCategoryTabs activeTab={tab} onChange={handleTabChange} />

      {tab === "words" ? (
        <div className="space-y-4">
          <nav
            aria-label={t("verbsFilterAria")}
            className="flex flex-wrap gap-2"
          >
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleFilterChange(option.id)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  listFilter === option.id
                    ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-200"
                    : "border-border text-muted-foreground hover:border-sky-400/60 hover:text-foreground",
                )}
                aria-current={listFilter === option.id ? "true" : undefined}
              >
                {option.label}
              </button>
            ))}
          </nav>

          {listFilter === "irregular" ? (
            <div className="rounded-2xl border border-dashed border-brand-300/80 bg-brand-50/50 px-4 py-3 text-sm text-brand-900 dark:border-brand-700 dark:bg-brand-950/30 dark:text-brand-100">
              {t("verbsIrregularHint")}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-300/80 bg-brand-50/50 px-4 py-3 text-sm text-brand-900 dark:border-brand-700 dark:bg-brand-950/30 dark:text-brand-100">
              {t("verbsRegularHint")}
            </div>
          )}

          <VerbsTable
            verbs={listVerbs}
            listFilter={listFilter}
            sortKey={sortKey}
            infinitiveDescending={infinitiveDescending}
            onSortInfinitive={handleSortInfinitive}
            onSortType={handleSortType}
          />
        </div>
      ) : (
        <TopicExercisesView
          progressKey={vocabularyExerciseProgressKey(VERBS_REFERENCE_ID)}
          exercises={exercises}
          showHints={false}
          onExerciseSessionStart={refreshExerciseSet}
        />
      )}
    </section>
  );
}
