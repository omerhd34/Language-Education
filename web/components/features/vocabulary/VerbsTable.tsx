"use client";

import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpAZ,
  ChevronsUpDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { EnglishVerb } from "@/data/vocabulary/verbs";
import type {
  VerbListFilter,
  VerbTableSortKey,
} from "@/lib/vocabulary/sortVerbs";
import { VerbFormSpeakButton } from "@/components/features/vocabulary/VerbFormSpeakButton";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function VerbFormCell({ form, muted }: { form: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className={cn("min-w-0", muted ? "text-muted-foreground" : undefined)}
      >
        {form}
      </span>
      <VerbFormSpeakButton form={form} />
    </div>
  );
}

type VerbsTableProps = {
  verbs: EnglishVerb[];
  listFilter: VerbListFilter;
  sortKey: VerbTableSortKey;
  infinitiveDescending: boolean;
  onSortInfinitive: () => void;
  onSortType: () => void;
};

const headerButtonClassName = cn(
  "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1 py-0.5 text-left font-semibold",
  "text-foreground transition-colors hover:text-sky-700 dark:hover:text-sky-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40",
);

const sortIconMutedClassName = "size-4 shrink-0 text-muted-foreground/70";
const sortIconActiveClassName =
  "size-4 shrink-0 text-sky-600 dark:text-sky-300";

export function VerbsTable({
  verbs,
  listFilter,
  sortKey,
  infinitiveDescending,
  onSortInfinitive,
  onSortType,
}: VerbsTableProps) {
  const t = useTranslations("Vocabulary");

  if (verbs.length === 0) {
    return <p className="page-subtitle mt-0">{t("verbsEmptyFilter")}</p>;
  }

  const typeSortable = listFilter === "all";

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
      <table className="w-full min-w-130 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th
              scope="col"
              className="px-4 py-3"
              aria-sort={
                sortKey === "infinitive"
                  ? infinitiveDescending
                    ? "descending"
                    : "ascending"
                  : "none"
              }
            >
              <button
                type="button"
                className={headerButtonClassName}
                onClick={onSortInfinitive}
                aria-label={
                  sortKey === "infinitive" && infinitiveDescending
                    ? t("verbsSortInfinitiveDesc")
                    : sortKey === "infinitive"
                      ? t("verbsSortInfinitiveAsc")
                      : t("verbsSortInfinitive")
                }
              >
                <span>{t("verbsColInfinitive")}</span>
                {sortKey === "infinitive" ? (
                  infinitiveDescending ? (
                    <ArrowDownAZ
                      className={sortIconActiveClassName}
                      aria-hidden
                    />
                  ) : (
                    <ArrowUpAZ
                      className={sortIconActiveClassName}
                      aria-hidden
                    />
                  )
                ) : (
                  <ChevronsUpDown
                    className={sortIconMutedClassName}
                    aria-hidden
                  />
                )}
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              {t("verbsColPastSimple")}
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              {t("verbsColPastParticiple")}
            </th>
            <th
              scope="col"
              className="hidden px-4 py-3 sm:table-cell"
              aria-sort={sortKey === "type" ? "other" : "none"}
            >
              {typeSortable ? (
                <button
                  type="button"
                  className={cn(
                    headerButtonClassName,
                    sortKey === "type" && "text-sky-700 dark:text-sky-200",
                  )}
                  onClick={onSortType}
                  aria-label={t("verbsSortType")}
                  aria-pressed={sortKey === "type"}
                >
                  <span>{t("verbsColType")}</span>
                  {sortKey === "type" ? (
                    <ArrowDownWideNarrow
                      className={sortIconActiveClassName}
                      aria-hidden
                    />
                  ) : (
                    <ChevronsUpDown
                      className={sortIconMutedClassName}
                      aria-hidden
                    />
                  )}
                </button>
              ) : (
                <span className="font-semibold text-foreground">
                  {t("verbsColType")}
                </span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {verbs.map((verb) => (
            <tr
              key={verb.id}
              className="border-b border-border/80 last:border-0"
            >
              <td className="px-4 py-2.5 font-medium text-brand-950 dark:text-brand-50">
                <VerbFormCell form={verb.infinitive} />
              </td>
              <td className="px-4 py-2.5 text-brand-800 dark:text-brand-200">
                <VerbFormCell form={verb.pastSimple} />
              </td>
              <td className="px-4 py-2.5 text-brand-800 dark:text-brand-200">
                <VerbFormCell
                  form={verb.pastParticiple}
                  muted={verb.pastSimple === verb.pastParticiple}
                />
              </td>
              <td className="hidden px-4 py-2.5 sm:table-cell">
                <Badge
                  variant={verb.regular ? "secondary" : "outline"}
                  className="font-normal"
                >
                  {verb.regular
                    ? t("verbsTypeRegular")
                    : t("verbsTypeIrregular")}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
