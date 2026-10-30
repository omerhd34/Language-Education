import { useTranslations } from "next-intl";
import { AnnouncementItem } from "@/components/features/landing/AnnouncementItem";
import { Container } from "@/components/ui/Container";

const ANNOUNCEMENT_KEYS = ["beta", "lessons", "progress"] as const;

export function LandingAnnouncements() {
  const t = useTranslations("Announcements");

  return (
    <section
      aria-labelledby="announcements-heading"
      className="border-t border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/50"
    >
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl space-y-3">
          <h2
            id="announcements-heading"
            className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10">
          {ANNOUNCEMENT_KEYS.map((key) => (
            <AnnouncementItem
              key={key}
              date={t(`items.${key}.date`)}
              dateLabel={t(`items.${key}.dateLabel`)}
              title={t(`items.${key}.title`)}
              body={t(`items.${key}.body`)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
