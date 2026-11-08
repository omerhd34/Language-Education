"use client";

import { Lock } from "lucide-react";
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

type LevelLockedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | null;
  ctaLabel: string;
};

export function LevelLockedDialog({
  open,
  onOpenChange,
  title,
  description,
  ctaLabel,
}: LevelLockedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader className="items-center gap-4 text-center sm:items-center sm:text-center">
          <span
            className="inline-flex size-14 items-center justify-center rounded-2xl bg-amber-500/14 text-amber-700 shadow-[inset_0_1px_0_rgb(255_255_255/55%),inset_0_0_0_1px_rgb(245_158_11/22%)] dark:bg-amber-400/12 dark:text-amber-200 dark:shadow-[inset_0_1px_0_rgb(255_255_255/12%),inset_0_0_0_1px_rgb(251_191_36/20%)]"
            aria-hidden
          >
            <Lock className="size-5" strokeWidth={1.75} />
          </span>
          <div className="space-y-2">
            <DialogTitle className="text-balance text-[18px] leading-[1.35] text-brand-950 dark:text-brand-100">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="text-pretty text-sm leading-relaxed text-brand-600 dark:text-brand-400">
                {description}
              </DialogDescription>
            ) : null}
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-stretch">
          <DialogClose render={<Button type="button" className="w-full" />}>
            {ctaLabel}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
