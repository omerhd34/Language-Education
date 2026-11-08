import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";

export async function TopicContentMissing() {
  const t = await getTranslations("Topic");

  return (
    <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
      <h2 className="section-title">
        {t("contentMissingTitle")}
      </h2>
      <p className="page-subtitle mt-0">
        {t("contentMissingBody")}
      </p>
      <ButtonLink href="/panel#dilbilgisi" variant="outline">
        {t("backToTopics")}
      </ButtonLink>
    </div>
  );
}
