import { getTranslations } from "next-intl/server";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { ListeningLevel } from "@/data/listenings/types";

type ListeningLevelLockedProps = {
  level: ListeningLevel;
  requiredLevel: ListeningLevel;
};

export async function ListeningLevelLocked({
  level,
  requiredLevel,
}: ListeningLevelLockedProps) {
  const t = await getTranslations("Listening");

  return (
    <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
        <Lock className="size-5" aria-hidden />
      </span>
      <h2 className="section-title">{t("levelLockedTitle", { level })}</h2>
      <p className="page-subtitle mt-0">
        {t("levelLockedHint", { level, requiredLevel })}
      </p>
      <ButtonLink href="/panel#dinleme" variant="outline">
        {t("backToListening")}
      </ButtonLink>
    </div>
  );
}
