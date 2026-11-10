export const instant = false;

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ListeningLevelLocked } from "@/components/features/listening/ListeningLevelLocked";
import { ListeningPageHeader } from "@/components/features/listening/ListeningPageHeader";
import { ListeningSectionView } from "@/components/features/listening/ListeningSectionView";
import {
  getListeningSectionById,
  getListeningSectionIndexInLevel,
  listeningSections,
} from "@/lib/listeningContent";
import {
  canAccessListeningLevel,
  getRequiredListeningLevelToUnlock,
} from "@/lib/listeningAccess";
import { parseListeningSectionTab } from "@/lib/listeningSectionTab";

type PageProps = {
  params: Promise<{ locale: string; sectionId: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
};

export function generateStaticParams() {
  return listeningSections.map((section) => ({ sectionId: section.id }));
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  const tab = parseListeningSectionTab(resolvedSearch.tab);
  const t = await getTranslations({ locale, namespace: "Listening" });
  const section = getListeningSectionById(sectionId);

  if (!section) {
    return { title: t("title") };
  }

  if (tab === "practice") {
    return { title: t("documentTitlePractice", { title: section.title }) };
  }

  return { title: t("documentTitle", { title: section.title }) };
}

export default async function ListeningSectionPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, sectionId } = await params;
  const resolvedSearch = await searchParams;
  setRequestLocale(locale);

  const section = getListeningSectionById(sectionId);
  if (!section) {
    notFound();
  }

  const index = getListeningSectionIndexInLevel(sectionId);
  const unlocked = canAccessListeningLevel(section.level);
  const requiredLevel = getRequiredListeningLevelToUnlock(section.level);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4 sm:p-6 lg:p-8">
      <ListeningPageHeader
        title={section.title}
        titleEn={section.titleEn}
        level={section.level}
        index={index}
        sectionId={sectionId}
      />
      {!unlocked && requiredLevel ? (
        <ListeningLevelLocked
          level={section.level}
          requiredLevel={requiredLevel}
        />
      ) : (
        <ListeningSectionView section={section} />
      )}
    </div>
  );
}
