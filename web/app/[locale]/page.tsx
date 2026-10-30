import { setRequestLocale } from "next-intl/server";
import { LandingHero } from "@/components/features/landing/LandingHero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingHero />;
}
