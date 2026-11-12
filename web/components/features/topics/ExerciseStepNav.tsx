"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type ExerciseStepNavProps = {
  canGoPrevious: boolean;
  canGoNext: boolean;
  nextLabel: string;
  nextVariant?: "default" | "outline";
  onPrevious: () => void;
  onNext: () => void;
  children?: ReactNode;
  trailing?: ReactNode;
};

export function ExerciseStepNav({
  canGoPrevious,
  canGoNext,
  nextLabel,
  nextVariant = "outline",
  onPrevious,
  onNext,
  children,
  trailing,
}: ExerciseStepNavProps) {
  const t = useTranslations("Topic");

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="size-4" aria-hidden />
        {t("previous")}
      </Button>
      <Button
        type="button"
        variant={nextVariant}
        className="gap-2"
        onClick={onNext}
        disabled={!canGoNext}
      >
        {nextLabel}
        <ChevronRight className="size-4" aria-hidden />
      </Button>
      {trailing}
      {children}
    </div>
  );
}
