export const instant = false;

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReadingLevelLocked } from "@/components/features/reading/ReadingLevelLocked";
import { ReadingPageHeader } from "@/components/features/reading/ReadingPageHeader";
import { ReadingSectionView } from "@/components/features/reading/ReadingSectionView";
import {
  getReadingSectionById,
  getReadingSectionIndexInLevel,
  readingSections,
} from "@/lib/readingContent";
import {
  canAccessReadingLevel,
  getRequiredReadingLevelToUnlock,
} from "@/lib/readingAccess";
import { parseReadingSectionTab } from "@/lib/readingSectionTab";

type PageProps = {
  params: Promise<{ locale: string; sectionId: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
};

export function generateStaticParams() {
  return readingSections.map((section) => ({ sectionId: section.id }));
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  const tab = parseReadingSectionTab(resolvedSearch.tab);
  const t = await getTranslations({ locale, namespace: "Reading" });
  const section = getReadingSectionById(sectionId);

  if (!section) {
    return { title: t("title") };
  }

  if (tab === "practice") {
    return { title: t("documentTitlePractice", { title: section.title }) };
  }

  return { title: t("documentTitle", { title: section.title }) };
}

export default async function ReadingSectionPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  setRequestLocale(locale);

  const section = getReadingSectionById(sectionId);
  if (!section) {
    notFound();
  }

  const tab = parseReadingSectionTab(resolvedSearch.tab);
  const index = getReadingSectionIndexInLevel(sectionId);
  const unlocked = canAccessReadingLevel(section.level);
  const requiredLevel = getRequiredReadingLevelToUnlock(section.level);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4 sm:p-6 lg:p-8">
      <ReadingPageHeader
        title={section.title}
        titleEn={section.titleEn}
        level={section.level}
        index={index}
        sectionId={sectionId}
      />
      {!unlocked && requiredLevel ? (
        <ReadingLevelLocked
          level={section.level}
          requiredLevel={requiredLevel}
        />
      ) : (
        <ReadingSectionView section={section} />
      )}
    </div>
  );
}
