"use client";

import { useTranslations } from "next-intl";
import { useSpeakingSectionStatus } from "@/hooks/useSpeakingProgress";

type SpeakingSectionPassStatusProps = {
  sectionId: string;
};

export function SpeakingSectionPassStatus({
  sectionId,
}: SpeakingSectionPassStatusProps) {
  const t = useTranslations("Speaking");
  const { complete } = useSpeakingSectionStatus(sectionId);

  return (
    <p className="text-sm text-brand-600 dark:text-brand-400">
      {complete ? t("sectionPassedHint") : t("sectionPassHint")}
    </p>
  );
}
