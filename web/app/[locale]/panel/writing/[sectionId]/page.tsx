export const instant = false;

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { WritingLevelLocked } from "@/components/features/writing/WritingLevelLocked";
import { WritingPageHeader } from "@/components/features/writing/WritingPageHeader";
import { WritingSectionView } from "@/components/features/writing/WritingSectionView";
import {
  getWritingSectionById,
  getWritingSectionIndexInLevel,
  writingSections,
} from "@/lib/writingContent";
import {
  canAccessWritingLevel,
  getRequiredWritingLevelToUnlock,
} from "@/lib/writingAccess";
import { parseWritingSectionTab } from "@/lib/writingSectionTab";

type PageProps = {
  params: Promise<{ locale: string; sectionId: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
};

export function generateStaticParams() {
  return writingSections.map((section) => ({ sectionId: section.id }));
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  const tab = parseWritingSectionTab(resolvedSearch.tab);
  const t = await getTranslations({ locale, namespace: "Writing" });
  const section = getWritingSectionById(sectionId);

  if (!section) {
    return { title: t("title") };
  }

  if (tab === "practice") {
    return { title: t("documentTitlePractice", { title: section.title }) };
  }

  return { title: t("documentTitle", { title: section.title }) };
}

export default async function WritingSectionPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  setRequestLocale(locale);

  const section = getWritingSectionById(sectionId);
  if (!section) {
    notFound();
  }

  const tab = parseWritingSectionTab(resolvedSearch.tab);
  void tab;

  const index = getWritingSectionIndexInLevel(sectionId);
  const unlocked = canAccessWritingLevel(section.level);
  const requiredLevel = getRequiredWritingLevelToUnlock(section.level);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4 sm:p-6 lg:p-8">
      <WritingPageHeader
        title={section.title}
        titleEn={section.titleEn}
        level={section.level}
        index={index}
        sectionId={sectionId}
      />
      {!unlocked && requiredLevel ? (
        <WritingLevelLocked
          level={section.level}
          requiredLevel={requiredLevel}
        />
      ) : (
        <WritingSectionView section={section} />
      )}
    </div>
  );
}
