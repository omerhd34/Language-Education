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
        className="page-title"
      >
        {t(SKILL_TITLE_KEYS[skill])}
      </h1>
      <p className="page-subtitle mt-0">
        {t("skillSectionSubtitle")}
      </p>
    </section>
  );
}
