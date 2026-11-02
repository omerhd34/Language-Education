"use client";

import { useTranslations } from "next-intl";
import type { VocabularyWord } from "@/data/vocabulary";

type VocabularyWordListProps = {
  words: VocabularyWord[];
};

export function VocabularyWordList({ words }: VocabularyWordListProps) {
  const t = useTranslations("Vocabulary");

  if (words.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("emptyWords")}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-200/70 dark:border-brand-800/70">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{t("tableCaption")}</caption>
        <thead className="bg-brand-50/80 dark:bg-brand-900/60">
          <tr>
            <th
              scope="col"
              className="w-14 px-4 py-3 font-semibold text-brand-700 dark:text-brand-300"
            >
              #
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-brand-700 dark:text-brand-300"
            >
              {t("english")}
            </th>
            <th
              scope="col"
              className="px-4 py-3 font-semibold text-brand-700 dark:text-brand-300"
            >
              {t("turkish")}
            </th>
          </tr>
        </thead>
        <tbody>
          {words.map((word, index) => (
            <tr
              key={word.id}
              className="border-t border-brand-200/60 odd:bg-white/40 even:bg-brand-50/40 dark:border-brand-800/60 dark:odd:bg-brand-950/20 dark:even:bg-brand-900/30"
            >
              <td className="px-4 py-3 tabular-nums text-brand-500 dark:text-brand-400">
                {index + 1}
              </td>
              <td className="px-4 py-3 font-medium text-brand-950 dark:text-brand-100">
                {word.en}
              </td>
              <td className="px-4 py-3 text-brand-700 dark:text-brand-300">
                {word.tr}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
