"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TimerOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStudiedTodayVocabularyWordsQuery } from "@/store/api";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { cn } from "@/lib/utils";

let cancelRequest: Promise<unknown> | null = null;

type CancelStudyTimerButtonProps = {
  className?: string;
  size?: "sm" | "default";
};

export function CancelStudyTimerButton({
  className,
  size = "sm",
}: CancelStudyTimerButtonProps) {
  const t = useTranslations("Dashboard");
  const { data } = useStudiedTodayVocabularyWordsQuery();
  const cancelTimer = useVocabularyStore((state) => state.cancelStudyTimer);
  const isLoading = useVocabularyStore((state) => state.isCancellingTimer);
  const [open, setOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cancellableCount = data?.cancellableCount ?? 0;

  if (cancellableCount <= 0) {
    return null;
  }

  async function handleCancel() {
    if (cancelRequest) {
      try {
        await cancelRequest;
        setOpen(false);
      } catch {
        setHasError(true);
      }
      return;
    }

    setHasError(false);
    const request = cancelTimer();
    cancelRequest = request;
    try {
      await request;
      setOpen(false);
    } catch {
      setHasError(true);
    } finally {
      if (cancelRequest === request) {
        cancelRequest = null;
      }
    }
  }

  return (
    <>
      <Button
        type="button"
        size={size}
        variant="outline"
        className={className}
        onClick={() => {
          setHasError(false);
          setOpen(true);
        }}
      >
        <TimerOff className="size-3.5" aria-hidden />
        {t("cancelStudyTimer")}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (isLoading) {
            return;
          }
          setOpen(nextOpen);
          if (!nextOpen) {
            setHasError(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("cancelStudyTimerTitle")}</DialogTitle>
            <DialogDescription>
              {t("cancelStudyTimerDescription", { count: cancellableCount })}
            </DialogDescription>
          </DialogHeader>
          {hasError ? (
            <p className="text-sm text-destructive" role="alert">
              {t("cancelStudyTimerError")}
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" disabled={isLoading} />}
            >
              {t("cancelStudyTimerDismiss")}
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={() => {
                void handleCancel();
              }}
            >
              {t("cancelStudyTimerConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type ActiveStudyTimerNoticeProps = {
  className?: string;
};

export function ActiveStudyTimerNotice({
  className,
}: ActiveStudyTimerNoticeProps) {
  const t = useTranslations("Dashboard");
  const { data } = useStudiedTodayVocabularyWordsQuery();
  const cancellableCount = data?.cancellableCount ?? 0;

  if (cancellableCount <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-500/25 bg-sky-500/10 px-4 py-4 dark:border-sky-400/20 dark:bg-sky-400/10",
        className,
      )}
    >
      <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
        {t("studyTimerActiveHint", { count: cancellableCount })}
      </p>
      <CancelStudyTimerButton />
    </div>
  );
}
