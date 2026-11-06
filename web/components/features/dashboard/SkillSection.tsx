"use client";

import { useTranslations } from "next-intl";

const SKILL_TITLE_KEYS = {
  listening: "skillListeningTitle",
  writing: "skillWritingTitle",
  speaking: "skillSpeakingTitle",
  reading: "skillReadingTitle",
} as const;

const SKILL_SECTION_IDS = {
  listening: "dinleme",
  writing: "yazma",
  speaking: "konusma",
  reading: "okuma",
} as const;

export type SkillSectionId = keyof typeof SKILL_TITLE_KEYS;

type SkillSectionProps = {
  skill: SkillSectionId;
};

export function SkillSection({ skill }: SkillSectionProps) {
  const t = useTranslations("Dashboard");
  const headingId = `${skill}-heading`;

  return (
    <section
      id={SKILL_SECTION_IDS[skill]}
      aria-labelledby={headingId}
      className="space-y-2"
    >
      <h1
        id={headingId}
        className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
      >
        {t(SKILL_TITLE_KEYS[skill])}
      </h1>
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("skillSectionSubtitle")}
      </p>
    </section>
  );
}
