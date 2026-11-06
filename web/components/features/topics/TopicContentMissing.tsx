import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";

export async function TopicContentMissing() {
  const t = await getTranslations("Topic");

  return (
    <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
      <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
        {t("contentMissingTitle")}
      </h2>
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("contentMissingBody")}
      </p>
      <ButtonLink href="/panel#dilbilgisi" variant="outline">
        {t("backToTopics")}
      </ButtonLink>
    </div>
  );
}
