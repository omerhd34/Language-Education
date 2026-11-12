"use client";

import {
  ArrowUpCircle,
  BookA,
  BookOpenCheck,
  CircleCheckBig,
  ClipboardCheck,
  Clock,
  Gauge,
  Layers3,
  LayoutDashboard,
  ListOrdered,
  ScrollText,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { GeneralRuleItem } from "@/components/features/dashboard/GeneralRuleItem";
import { GeneralStepCard } from "@/components/features/dashboard/GeneralStepCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ACTIVE_VOCABULARY_WINDOW } from "@/lib/vocabularyAccess";
import {
  LEARN_WORD_PERIOD_LIMIT,
  VOCABULARY_QUIZ_CYCLE_WORD_TARGET,
} from "@/lib/vocabularyLimits";

const RULE_KEYS = [
  "levelProgression",
  "grammarSequence",
  "vocabularyWindow",
  "studyTimer",
  "wordQuota",
  "skillsCompletion",
] as const;

const STEP_KEYS = [
  "overview",
  "grammar",
  "vocabulary",
  "skills",
  "levelExam",
  "progress",
] as const;

const RULE_ICONS = {
  levelProgression: ArrowUpCircle,
  grammarSequence: BookOpenCheck,
  vocabularyWindow: Layers3,
  studyTimer: Clock,
  wordQuota: Gauge,
  skillsCompletion: CircleCheckBig,
} as const;

const STEP_ICONS = {
  overview: LayoutDashboard,
  grammar: ListOrdered,
  vocabulary: BookA,
  skills: CircleCheckBig,
  levelExam: ClipboardCheck,
  progress: TrendingUp,
} as const;

export function GeneralSection() {
  const t = useTranslations("Dashboard");

  const messageValues = {
    window: ACTIVE_VOCABULARY_WINDOW,
    limit: LEARN_WORD_PERIOD_LIMIT,
    quizTarget: VOCABULARY_QUIZ_CYCLE_WORD_TARGET,
  };

  return (
    <section
      id="general"
      aria-labelledby="general-heading"
      className="space-y-6"
    >
      <div>
        <h1 id="general-heading" className="page-title">
          {t("generalTitle")}
        </h1>
        <p className="page-subtitle">{t("generalSubtitle")}</p>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300"
              aria-hidden
            >
              <ScrollText className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg">{t("generalRulesTitle")}</CardTitle>
              <CardDescription>{t("generalRulesSubtitle")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {RULE_KEYS.map((key) => (
                <GeneralRuleItem key={key} icon={RULE_ICONS[key]}>
                  {t(`generalRules.${key}`, messageValues)}
                </GeneralRuleItem>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15"
              aria-hidden
            >
              <ListOrdered className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-lg">{t("generalStepsTitle")}</CardTitle>
              <CardDescription>{t("generalStepsSubtitle")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {STEP_KEYS.map((key, index) => (
                <GeneralStepCard
                  key={key}
                  index={index + 1}
                  icon={STEP_ICONS[key]}
                  title={t(`generalSteps.${key}.title`)}
                  body={t(`generalSteps.${key}.body`, messageValues)}
                />
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
