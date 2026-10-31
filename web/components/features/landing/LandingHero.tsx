import { useTranslations } from "next-intl";
import { HiAcademicCap } from "react-icons/hi2";
import { HeroLevelPath } from "@/components/features/landing/HeroLevelPath";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const navButtonStyle = {
  height: 40,
  minHeight: 40,
  maxHeight: 40,
  boxSizing: "border-box",
} as const;

export function LandingHero() {
  const t = useTranslations("Landing");
  const tNav = useTranslations("Nav");

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(48,109,132,0.22),transparent_55%),linear-gradient(to_bottom,rgb(220,227,239),rgb(238,242,248))] dark:bg-[radial-gradient(ellipse_at_top,rgb(83,102,132,0.28),transparent_55%),linear-gradient(to_bottom,rgb(17,21,34),rgb(30,38,59))]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_40%,rgba(48,61,89,0.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_40%,rgba(152,169,196,0.12),transparent_60%)]" />

      <Container className="relative flex flex-1 flex-col justify-center gap-6 py-12 lg:gap-7 lg:py-14">
        <div className="animate-[fade-up_0.7s_ease-out_both] flex items-start gap-2.5 sm:gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-800 sm:text-5xl dark:text-brand-400">
            {tNav("brand")}
          </h1>
          <Badge
            variant="default"
            aria-label={t("aiBadgeLabel")}
            title={t("aiBadgeLabel")}
            className="mt-1 tracking-[0.14em] uppercase sm:mt-1.5"
          >
            {t("aiBadge")}
          </Badge>
        </div>

        <div className="max-w-3xl animate-[fade-up_0.7s_ease-out_0.12s_both] space-y-3">
          <h2 className="font-display text-xl font-semibold leading-snug text-brand-950 sm:text-2xl dark:text-brand-100">
            {t("headline")}
          </h2>
          <p className="text-sm leading-6 text-brand-600 sm:text-base sm:leading-7 dark:text-brand-400">
            {t("subheadline")}
          </p>
        </div>

        <div className="animate-[fade-up_0.7s_ease-out_0.2s_both]">
          <a
            href="#egitim-sistemi"
            className={buttonVariants({ variant: "outline", size: "lg" })}
            style={navButtonStyle}
          >
            <HiAcademicCap className="size-4 shrink-0" aria-hidden />
            {t("ctaSystem")}
          </a>
        </div>

        <div className="animate-[fade-up_0.7s_ease-out_0.28s_both]">
          <HeroLevelPath
            label={t("levelsLabel")}
            caption={t("levelsCaption")}
          />
        </div>
      </Container>
    </section>
  );
}
