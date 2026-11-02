"use client";

import { useTranslations } from "next-intl";
import { VocabularyCategoryCard } from "@/components/features/dashboard/VocabularyCategoryCard";
import { vocabularyCategories } from "@/data/vocabulary";

export function VocabularySection() {
  const t = useTranslations("Dashboard");

  return (
    <section
      id="kelime"
      aria-labelledby="vocabulary-heading"
      className="space-y-4"
    >
      <div>
        <h1
          id="vocabulary-heading"
          className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
        >
          {t("vocabularyTitle")}
        </h1>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          {t("vocabularySubtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vocabularyCategories.map((category, index) => (
          <VocabularyCategoryCard
            key={category.id}
            category={category}
            index={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
