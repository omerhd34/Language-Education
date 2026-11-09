export const instant = false;

import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardStatsBar } from "@/components/features/dashboard/DashboardStatsBar";
import { StudiedTodaySection } from "@/components/features/vocabulary/StudiedTodaySection";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return {
    title: t("studiedTodayDocumentTitle"),
  };
}

export default async function StudiedTodayPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="page-shell">
      <DashboardStatsBar />
      <StudiedTodaySection />
    </div>
  );
}
