"use client";

import { useTranslations } from "next-intl";
import { EducationStep } from "@/components/features/landing/EducationStep";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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

export function GeneralSection() {
  const t = useTranslations("Dashboard");

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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="section-title text-lg">
              {t("generalRulesTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2.5 pl-5 text-sm leading-6 text-brand-600 dark:text-brand-400">
              {RULE_KEYS.map((key) => (
                <li key={key}>
                  {t(`generalRules.${key}`, {
                    window: ACTIVE_VOCABULARY_WINDOW,
                    limit: LEARN_WORD_PERIOD_LIMIT,
                    quizTarget: VOCABULARY_QUIZ_CYCLE_WORD_TARGET,
                  })}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="section-title text-lg">
              {t("generalStepsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 sm:px-0">
            <ol className="px-6">
              {STEP_KEYS.map((key, index) => (
                <EducationStep
                  key={key}
                  index={index + 1}
                  title={t(`generalSteps.${key}.title`)}
                  body={t(`generalSteps.${key}.body`, {
                    limit: LEARN_WORD_PERIOD_LIMIT,
                    quizTarget: VOCABULARY_QUIZ_CYCLE_WORD_TARGET,
                  })}
                />
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
