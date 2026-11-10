"use client";

import { useTranslations } from "next-intl";
import { useListeningSectionStatus } from "@/hooks/useListeningProgress";

type ListeningSectionPassStatusProps = {
  sectionId: string;
};

export function ListeningSectionPassStatus({
  sectionId,
}: ListeningSectionPassStatusProps) {
  const t = useTranslations("Listening");
  const { complete } = useListeningSectionStatus(sectionId);

  return (
    <p className="text-sm text-brand-600 dark:text-brand-400">
      {complete ? t("sectionPassedHint") : t("sectionPassHint")}
    </p>
  );
}
