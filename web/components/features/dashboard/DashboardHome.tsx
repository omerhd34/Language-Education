"use client";

import { useTranslations } from "next-intl";
import { DashboardStatsBar } from "@/components/features/dashboard/DashboardStatsBar";
import { ProgressSection } from "@/components/features/dashboard/ProgressSection";
import { ListeningSection } from "@/components/features/dashboard/ListeningSection";
import { ReadingSection } from "@/components/features/dashboard/ReadingSection";
import { WritingSection } from "@/components/features/dashboard/WritingSection";
import { SkillSection } from "@/components/features/dashboard/SkillSection";
import { TopicsSection } from "@/components/features/dashboard/TopicsSection";
import { VocabularySection } from "@/components/features/dashboard/VocabularySection";
import { usePanelHash } from "@/hooks/usePanelHash";

const SKILL_BY_HASH = {
  dinleme: "listening",
  yazma: "writing",
  konusma: "speaking",
  okuma: "reading",
} as const;

type SkillHash = keyof typeof SKILL_BY_HASH;

function isSkillHash(section: string): section is SkillHash {
  return section in SKILL_BY_HASH;
}

const READY_SECTIONS = new Set<string>([
  "dilbilgisi",
  "kelimeler",
  "ilerleme",
  ...Object.keys(SKILL_BY_HASH),
]);

export function DashboardHome() {
  const t = useTranslations("Dashboard");
  const hash = usePanelHash();
  const section = hash.replace(/^#/, "");

  return (
    <div className="page-shell">
      <DashboardStatsBar />
      {section === "dilbilgisi" ? <TopicsSection /> : null}
      {section === "kelimeler" ? <VocabularySection /> : null}
      {section === "okuma" ? <ReadingSection /> : null}
      {section === "dinleme" ? <ListeningSection /> : null}
      {section === "yazma" ? <WritingSection /> : null}
      {isSkillHash(section) &&
      section !== "okuma" &&
      section !== "dinleme" &&
      section !== "yazma" ? (
        <SkillSection skill={SKILL_BY_HASH[section]} />
      ) : null}
      {section === "ilerleme" ? <ProgressSection /> : null}
      {section !== "" && !READY_SECTIONS.has(section) ? (
        <section className="space-y-2" aria-labelledby="section-soon-heading">
          <h1 id="section-soon-heading" className="page-title">
            {t("sectionSoonTitle")}
          </h1>
          <p className="page-subtitle mt-0">{t("sectionSoonBody")}</p>
        </section>
      ) : null}
    </div>
  );
}
