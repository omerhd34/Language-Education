export const instant = false;

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SpeakingLevelLocked } from "@/components/features/speaking/SpeakingLevelLocked";
import { SpeakingPageHeader } from "@/components/features/speaking/SpeakingPageHeader";
import { SpeakingSectionView } from "@/components/features/speaking/SpeakingSectionView";
import {
  getSpeakingSectionById,
  getSpeakingSectionIndexInLevel,
  speakingSections,
} from "@/lib/speakingContent";
import {
  canAccessSpeakingLevel,
  getRequiredSpeakingLevelToUnlock,
} from "@/lib/speakingAccess";
import { parseSpeakingSectionTab } from "@/lib/speakingSectionTab";

type PageProps = {
  params: Promise<{ locale: string; sectionId: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
};

export function generateStaticParams() {
  return speakingSections.map((section) => ({ sectionId: section.id }));
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  const tab = parseSpeakingSectionTab(resolvedSearch.tab);
  const t = await getTranslations({ locale, namespace: "Speaking" });
  const section = getSpeakingSectionById(sectionId);

  if (!section) {
    return { title: t("title") };
  }

  if (tab === "practice") {
    return { title: t("documentTitlePractice", { title: section.title }) };
  }

  return { title: t("documentTitle", { title: section.title }) };
}

export default async function SpeakingSectionPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  setRequestLocale(locale);

  const section = getSpeakingSectionById(sectionId);
  if (!section) {
    notFound();
  }

  const tab = parseSpeakingSectionTab(resolvedSearch.tab);
  void tab;

  const index = getSpeakingSectionIndexInLevel(sectionId);
  const unlocked = canAccessSpeakingLevel(section.level);
  const requiredLevel = getRequiredSpeakingLevelToUnlock(section.level);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4 sm:p-6 lg:p-8">
      <SpeakingPageHeader
        title={section.title}
        titleEn={section.titleEn}
        level={section.level}
        index={index}
        sectionId={sectionId}
      />
      {!unlocked && requiredLevel ? (
        <SpeakingLevelLocked
          level={section.level}
          requiredLevel={requiredLevel}
        />
      ) : (
        <SpeakingSectionView section={section} />
      )}
    </div>
  );
}
