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
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <DashboardStatsBar />
      <StudiedTodaySection />
    </div>
  );
}
