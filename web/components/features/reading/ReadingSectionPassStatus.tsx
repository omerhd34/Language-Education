"use client";

import { useTranslations } from "next-intl";
import { useReadingSectionStatus } from "@/hooks/useReadingProgress";

type ReadingSectionPassStatusProps = {
  sectionId: string;
};

export function ReadingSectionPassStatus({
  sectionId,
}: ReadingSectionPassStatusProps) {
  const t = useTranslations("Reading");
  const { complete } = useReadingSectionStatus(sectionId);

  return (
    <p className="text-sm text-brand-600 dark:text-brand-400">
      {complete ? t("sectionPassedHint") : t("sectionPassHint")}
    </p>
  );
}
