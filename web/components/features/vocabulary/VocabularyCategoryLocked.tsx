"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ACTIVE_VOCABULARY_WINDOW } from "@/lib/vocabularyAccess";

type VocabularyCategoryLockedProps = {
  index: number;
};

export function VocabularyCategoryLocked({
  index,
}: VocabularyCategoryLockedProps) {
  const t = useTranslations("Vocabulary");

  return (
    <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
        <Lock className="size-5" aria-hidden />
      </span>
      <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
        {t("categoryLockedTitle", { index })}
      </h2>
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("categoryLockedBody", { window: ACTIVE_VOCABULARY_WINDOW })}
      </p>
      <ButtonLink href="/panelim#kelime" variant="outline">
        {t("backToVocabulary")}
      </ButtonLink>
    </div>
  );
}
