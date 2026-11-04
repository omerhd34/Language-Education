"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ExerciseResultDialogProps = {
  open: boolean;
  variant: "correct" | "incorrect";
  title?: string | null;
  explanation?: string | null;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  continueLabel: string;
};

export function ExerciseResultDialog({
  open,
  variant,
  title,
  explanation,
  onOpenChange,
  onContinue,
  continueLabel,
}: ExerciseResultDialogProps) {
  const t = useTranslations("Topic");
  const isCorrect = variant === "correct";
  const description = isCorrect
    ? t("correctDialogBody")
    : explanation?.trim() || t("incorrectDialogBody");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <span
            className={
              isCorrect
                ? "mx-auto mb-1 flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                : "mx-auto mb-1 flex size-14 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-300"
            }
          >
            {isCorrect ? (
              <CheckCircle2 className="size-7" aria-hidden />
            ) : (
              <XCircle className="size-7" aria-hidden />
            )}
          </span>
          <DialogTitle
            className={
              isCorrect
                ? "font-display text-2xl text-emerald-700 dark:text-emerald-300"
                : "font-display text-2xl text-red-700 dark:text-red-300"
            }
          >
            {title?.trim() || (isCorrect ? t("correct") : t("incorrect"))}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => {
              onOpenChange(false);
              onContinue();
            }}
          >
            {continueLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
