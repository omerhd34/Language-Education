"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ExerciseFinishedActionsProps = {
  onRetry: () => void;
  onBackToTypes?: () => void;
};

export function ExerciseFinishedActions({
  onRetry,
  onBackToTypes,
}: ExerciseFinishedActionsProps) {
  const t = useTranslations("Topic");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button type="button" onClick={onRetry}>
        <RotateCcw className="size-4" aria-hidden />
        {t("retry")}
      </Button>
      {onBackToTypes ? (
        <Button type="button" variant="outline" onClick={onBackToTypes}>
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToTypes")}
        </Button>
      ) : null}
    </div>
  );
}
