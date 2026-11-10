"use client";

import { useTranslations } from "next-intl";
import { useWritingSectionStatus } from "@/hooks/useWritingProgress";

type WritingSectionPassStatusProps = {
  sectionId: string;
};

export function WritingSectionPassStatus({
  sectionId,
}: WritingSectionPassStatusProps) {
  const t = useTranslations("Writing");
  const { complete } = useWritingSectionStatus(sectionId);

  return (
    <p className="text-sm text-brand-600 dark:text-brand-400">
      {complete ? t("sectionPassedHint") : t("sectionPassHint")}
    </p>
  );
}
