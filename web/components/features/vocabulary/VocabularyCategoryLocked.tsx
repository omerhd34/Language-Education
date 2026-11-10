"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ACTIVE_VOCABULARY_WINDOW } from "@/lib/vocabularyAccess";

type VocabularyCategoryLockedProps = {
  index: number;
  reason?: "level" | "window";
  requiredLevel?: string | null;
  level?: string | null;
};

export function VocabularyCategoryLocked({
  index,
  reason = "window",
  requiredLevel,
  level,
}: VocabularyCategoryLockedProps) {
  const t = useTranslations("Vocabulary");

  return (
    <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
        <Lock className="size-5" aria-hidden />
      </span>
      <h2 className="section-title">
        {reason === "level" && level
          ? t("levelLockedTitle", { level })
          : t("categoryLockedTitle", { index })}
      </h2>
      <p className="page-subtitle mt-0">
        {reason === "level" && requiredLevel && level
          ? t("levelLockedBody", { level, requiredLevel })
          : t("categoryLockedBody", { window: ACTIVE_VOCABULARY_WINDOW })}
      </p>
      <ButtonLink href="/panel#vocabulary" variant="outline">
        {t("backToVocabulary")}
      </ButtonLink>
    </div>
  );
}
