import { useTranslations } from "next-intl";
import { HeroAiBadge } from "@/components/features/landing/HeroAiBadge";
import { HeroLevelPath } from "@/components/features/landing/HeroLevelPath";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export function LandingHero() {
  const t = useTranslations("Landing");
  const tNav = useTranslations("Nav");

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(48,109,132,0.22),transparent_55%),linear-gradient(to_bottom,rgb(220,227,239),rgb(238,242,248))] dark:bg-[radial-gradient(ellipse_at_top,rgba(83,102,132,0.28),transparent_55%),linear-gradient(to_bottom,rgb(17,21,34),rgb(30,38,59))]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_40%,rgba(48,61,89,0.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_40%,rgba(152,169,196,0.12),transparent_60%)]" />

      <Container className="relative flex flex-1 flex-col justify-center gap-7 py-12 lg:gap-8 lg:py-14">
        <div className="animate-[fade-up_0.7s_ease-out_both] flex items-start gap-3 sm:gap-3.5">
          <p className="font-display text-4xl font-semibold tracking-tight text-brand-800 sm:text-6xl dark:text-brand-400">
            {tNav("brand")}
          </p>
          <HeroAiBadge label={t("aiBadge")} ariaLabel={t("aiBadgeLabel")} />
        </div>

        <div className="max-w-5xl animate-[fade-up_0.7s_ease-out_0.12s_both] space-y-4">
          <h1 className="max-w-4xl font-display text-3xl font-semibold leading-tight text-brand-950 sm:text-5xl dark:text-brand-100">
            {t("headline")}
          </h1>
          <p className="max-w-4xl text-base leading-7 text-brand-600 sm:text-lg dark:text-brand-400">
            {t("subheadline")}
          </p>
        </div>

        <div className="grid w-full max-w-xl animate-[fade-up_0.7s_ease-out_0.2s_both] grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href="#egitim-sistemi"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-brand-400/60 bg-transparent px-4 text-sm font-medium text-brand-950 transition-colors hover:bg-brand-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-brand-600 dark:text-brand-100 dark:hover:bg-brand-900 dark:focus-visible:ring-offset-brand-950"
          >
            {t("ctaSystem")}
          </a>
          <ButtonLink href="/register" className="h-11 w-full">
            {t("ctaPrimary")}
          </ButtonLink>
          <ButtonLink href="/login" variant="secondary" className="h-11 w-full">
            {t("ctaSecondary")}
          </ButtonLink>
        </div>

        <div className="animate-[fade-up_0.7s_ease-out_0.28s_both]">
          <HeroLevelPath
            label={t("levelsLabel")}
            caption={t("levelsCaption")}
          />
        </div>

        <ul className="grid w-full animate-[fade-up_0.7s_ease-out_0.35s_both] gap-6 border-t border-border/70 pt-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {(["placement", "flexibility", "ai", "pace"] as const).map((key) => (
            <li key={key} className="max-w-sm space-y-1">
              <p className="font-display text-base font-semibold text-brand-950 dark:text-brand-100">
                {t(`highlights.${key}.title`)}
              </p>
              <p className="text-sm leading-6 text-brand-600 dark:text-brand-400">
                {t(`highlights.${key}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
