import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export function LandingHero() {
  const t = useTranslations("Landing");
  const tNav = useTranslations("Nav");

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(48,109,132,0.22),transparent_55%),linear-gradient(to_bottom,rgba(220,227,239,0.55),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(83,102,132,0.28),transparent_55%),linear-gradient(to_bottom,rgba(17,21,34,0.55),transparent)]" />
      <Container className="relative flex flex-1 flex-col justify-center gap-8 py-16">
        <p className="font-display text-4xl font-semibold tracking-tight text-brand-800 sm:text-6xl dark:text-brand-400">
          {tNav("brand")}
        </p>
        <div className="max-w-3xl space-y-4">
          <h1 className="font-display text-3xl font-semibold leading-tight text-brand-950 sm:text-5xl dark:text-brand-100">
            {t("headline")}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-brand-600 sm:text-lg dark:text-brand-400">
            {t("subheadline")}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/register" className="w-full sm:w-auto">
            {t("ctaPrimary")}
          </ButtonLink>
          <ButtonLink
            href="/login"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {t("ctaSecondary")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
