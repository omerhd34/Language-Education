import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function LandingHero() {
  const t = useTranslations("Landing");
  const tNav = useTranslations("Nav");

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.18),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.2),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.12),transparent_55%),linear-gradient(to_bottom,rgba(9,9,11,0.4),transparent)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6">
        <p className="font-display text-4xl font-semibold tracking-tight text-teal-800 sm:text-6xl dark:text-teal-300">
          {tNav("brand")}
        </p>
        <div className="max-w-2xl space-y-4">
          <h1 className="font-display text-3xl font-semibold leading-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            {t("headline")}
          </h1>
          <p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
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
      </div>
    </section>
  );
}
