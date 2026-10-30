import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/features/marketing/MarketingPage";

export default async function BenefitsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.benefits");

  return <MarketingPage title={t("title")} description={t("description")} />;
}
