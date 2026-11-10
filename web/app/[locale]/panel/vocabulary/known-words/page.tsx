export const instant = false;
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardStatsBar } from "@/components/features/dashboard/DashboardStatsBar";
import { KnownWordsSection } from "@/components/features/vocabulary/KnownWordsSection";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return {
    title: t("knownWordsDocumentTitle"),
  };
}

export default async function KnownWordsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="page-shell">
      <DashboardStatsBar />
      <KnownWordsSection />
    </div>
  );
}
