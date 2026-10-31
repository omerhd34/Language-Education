import { setRequestLocale } from "next-intl/server";
import { AuthHomeSwitch } from "@/components/features/dashboard/AuthHomeSwitch";
import { LandingAnnouncements } from "@/components/features/landing/LandingAnnouncements";
import { LandingEducationSystem } from "@/components/features/landing/LandingEducationSystem";
import { LandingHero } from "@/components/features/landing/LandingHero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthHomeSwitch>
      <LandingHero />
      <LandingEducationSystem />
      <LandingAnnouncements />
    </AuthHomeSwitch>
  );
}
