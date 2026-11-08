"use client";

import { useTranslations } from "next-intl";
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Layers3,
  PencilLine,
  Play,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { useContinueActivities } from "@/hooks/useContinueActivity";
import { navigatePanelSection } from "@/hooks/usePanelHash";
import { usePathname, useRouter } from "@/i18n/navigation";
import { resolveContinueActivityDisplay } from "@/lib/resolveContinueActivity";
import type {
  ContinueActivity,
  ContinueActivityKind,
} from "@/lib/continueActivityStorage";

function kindIcon(kind: ContinueActivityKind) {
  switch (kind) {
    case "vocabulary_quiz":
    case "topic_exam":
      return ClipboardCheck;
    case "vocabulary_exercises":
    case "topic_exercises":
    case "combined_exercise":
      return PencilLine;
    case "vocabulary_category":
      return Layers3;
    case "topic_lesson":
    default:
      return BookOpen;
  }
}

function ContinueActivityRow({
  activity,
  goLabel,
  labels,
}: {
  activity: ContinueActivity;
  goLabel: string;
  labels: Parameters<typeof resolveContinueActivityDisplay>[1];
}) {
  const display = resolveContinueActivityDisplay(activity, labels);
  const Icon = kindIcon(activity.kind);

  return (
    <li>
      <Link
        href={activity.href}
        className="group flex min-w-0 items-center gap-3 rounded-xl px-1 py-1.5 transition-colors hover:bg-(--glass-btn) focus-visible:bg-(--glass-btn) focus-visible:outline-none"
        aria-label={`${goLabel}: ${display.title}`}
      >
        <span
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--glass-btn) text-brand-800 shadow-[inset_0_0_0_1px_var(--glass-line)] transition-colors group-hover:bg-(--glass-btn-hover) group-hover:text-sky-700 dark:text-brand-100 dark:group-hover:text-sky-200"
          aria-hidden
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-brand-950 dark:text-brand-100">
            {display.title}
          </span>
          <span className="mt-0.5 block text-xs text-brand-600 dark:text-brand-400">
            {display.kindLabel}
          </span>
        </span>
        <ChevronRight
          className="size-4 shrink-0 text-brand-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-800 dark:text-brand-400 dark:group-hover:text-brand-100"
          aria-hidden
        />
      </Link>
    </li>
  );
}

export function QuickContinueCard() {
  const t = useTranslations("Dashboard");
  const activities = useContinueActivities();
  const pathname = usePathname();
  const router = useRouter();

  const labels = {
    vocabularyQuiz: t("quickContinueKindQuiz"),
    vocabularyCategory: t("quickContinueKindCategory"),
    vocabularyExercises: t("quickContinueKindCategoryExercises"),
    topicLesson: t("quickContinueKindLesson"),
    topicExercises: t("quickContinueKindExercises"),
    topicExam: t("quickContinueKindTopicExam"),
    exam: t("quickContinueKindExam"),
    combinedExercise: t("quickContinueKindCombined"),
    fallbackTitle: t("quickContinueFallback"),
  };

  return (
    <article className="dashboard-panel dashboard-panel--stat">
      <p className="dashboard-panel__label text-base">
        <Play className="size-4" aria-hidden />
        {t("quickContinue")}
      </p>

      {activities.length > 0 ? (
        <ul className="mt-2 flex flex-1 flex-col justify-center gap-0.5">
          {activities.map((activity) => (
            <ContinueActivityRow
              key={`${activity.kind}:${activity.href}`}
              activity={activity}
              goLabel={t("quickContinueGo")}
              labels={labels}
            />
          ))}
        </ul>
      ) : (
        <>
          <p className="mt-3 text-sm text-brand-600 dark:text-brand-400">
            {t("quickContinueEmpty")}
          </p>
          <div className="mt-auto pt-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                const onPanel = pathname === "/panel" || pathname === "/";
                if (onPanel) {
                  navigatePanelSection("kelimeler");
                  return;
                }
                router.push("/panel#kelimeler");
              }}
            >
              {t("quickContinueExplore")}
            </Button>
          </div>
        </>
      )}
    </article>
  );
}
