import { getTranslations } from "next-intl/server";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { CefrLevel } from "@/data/dashboardTopics";

type TopicLevelLockedProps = {
  level: CefrLevel;
  requiredLevel: CefrLevel;
};

export async function TopicLevelLocked({
  level,
  requiredLevel,
}: TopicLevelLockedProps) {
  const t = await getTranslations("Topic");

  return (
    <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
        <Lock className="size-5" aria-hidden />
      </span>
      <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
        {t("levelLockedTitle", { level })}
      </h2>
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("levelLockedBody", { requiredLevel })}
      </p>
      <ButtonLink href="/panel#dilbilgisi" variant="outline">
        {t("backToTopics")}
      </ButtonLink>
    </div>
  );
}
