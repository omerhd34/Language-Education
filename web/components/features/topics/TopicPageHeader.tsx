"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import type { CefrLevel } from "@/data/dashboardTopics";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/i18n/navigation";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
import { getCefrLevelBadgeClass } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

export type TopicSectionNavItem = {
  id: string;
  title: string;
};

type TopicPageHeaderProps = {
  topicId: string;
  title: string;
  titleEn?: string;
  level: CefrLevel;
  index: number;
  activeTab: "lesson" | "exercises" | "exam";
  sections?: TopicSectionNavItem[];
  isExam?: boolean;
};

export function TopicPageHeader({
  topicId,
  title,
  titleEn,
  level,
  index,
  activeTab,
  sections = [],
  isExam = false,
}: TopicPageHeaderProps) {
  const t = useTranslations("Topic");
  const secondaryTitle = getDistinctSecondaryTitle(title, titleEn);

  const lessonHref = `/panelim/konular/${topicId}/anlatim`;
  const exercisesHref = `/panelim/konular/${topicId}/alistirmalar`;
  const examHref = `/panelim/konular/${topicId}/sinav`;
  const showSectionNav = activeTab === "lesson" && sections.length > 0;
  const showTopicExamTab = !isExam;

  return (
    <header className="space-y-4">
      <ButtonLink href="/panelim#konular" variant="outline" size="sm">
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToTopics")}
      </ButtonLink>

      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex w-fit rounded-md bg-zinc-500/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-700 uppercase dark:bg-zinc-400/15 dark:text-zinc-300">
          {isExam ? t("examLabel") : t("topicLabel", { index })}
        </p>
        <p
          className={cn(
            "inline-flex w-fit rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide uppercase",
            getCefrLevelBadgeClass(level),
          )}
        >
          {level}
        </p>
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl dark:text-brand-100">
          {title}
        </h1>
        {secondaryTitle ? (
          <p className="text-base font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
            {secondaryTitle}
          </p>
        ) : null}
      </div>

      <div className="space-y-3 border-b border-border">
        <nav aria-label={t("tabsAria")} className="flex gap-1">
          <Link
            href={lessonHref}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === "lesson"
                ? "border-sky-500 text-brand-950 dark:text-brand-100"
                : "border-transparent text-brand-500 hover:text-brand-950 dark:text-brand-400 dark:hover:text-brand-100",
            )}
            aria-current={activeTab === "lesson" ? "page" : undefined}
          >
            {t("lesson")}
          </Link>
          <Link
            href={exercisesHref}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              activeTab === "exercises"
                ? "border-sky-500 text-brand-950 dark:text-brand-100"
                : "border-transparent text-brand-500 hover:text-brand-950 dark:text-brand-400 dark:hover:text-brand-100",
            )}
            aria-current={activeTab === "exercises" ? "page" : undefined}
          >
            {t("exercises")}
          </Link>
          {showTopicExamTab ? (
            <Link
              href={examHref}
              className={cn(
                "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                activeTab === "exam"
                  ? "border-sky-500 text-brand-950 dark:text-brand-100"
                  : "border-transparent text-brand-500 hover:text-brand-950 dark:text-brand-400 dark:hover:text-brand-100",
              )}
              aria-current={activeTab === "exam" ? "page" : undefined}
            >
              {t("topicExamTab")}
            </Link>
          ) : null}
        </nav>

        {showSectionNav ? (
          <nav
            aria-label={t("sectionsAria")}
            className="flex flex-wrap gap-2 pb-3"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#section-${section.id}`}
                className="rounded-md bg-brand-100/70 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-sky-500/15 hover:text-brand-950 dark:bg-brand-900/50 dark:text-brand-300 dark:hover:bg-sky-500/20 dark:hover:text-brand-100"
              >
                {section.title}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
