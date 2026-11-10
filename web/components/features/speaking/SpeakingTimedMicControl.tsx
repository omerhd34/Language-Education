"use client";

import { useTranslations } from "next-intl";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/toast";
import { useSpeakingTimedRecorder } from "@/hooks/useSpeakingTimedRecorder";
import { formatDurationMmSs } from "@/lib/formatDuration";
import { cn } from "@/lib/utils";

type SpeakingTimedMicControlProps = {
  sessionKey: string;
  requiredMs?: number;
  onRequirementMet: () => void;
  disabled?: boolean;
};

export function SpeakingTimedMicControl({
  sessionKey,
  requiredMs,
  onRequirementMet,
  disabled = false,
}: SpeakingTimedMicControlProps) {
  const t = useTranslations("Speaking");
  const {
    isRecording,
    liveMs,
    requiredMs: required,
    progressPercent,
    requirementMet,
    toggleRecording,
  } = useSpeakingTimedRecorder({
    sessionKey,
    requiredMs,
    onRequirementMet,
  });

  const elapsedLabel = formatDurationMmSs(liveMs);
  const requiredLabel = formatDurationMmSs(required);

  async function handleMicClick() {
    if (disabled || requirementMet) {
      return;
    }
    const ok = await toggleRecording();
    if (!ok) {
      toast.add({
        id: "speaking-wheel-mic-denied",
        type: "error",
        title: t("micUnavailableTitle"),
        description: t("micUnavailableDescription"),
      });
    }
  }

  return (
    <div className="w-full min-w-0">
      <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 py-0.5 pl-0.5">
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          disabled={disabled || requirementMet}
          className={cn(
            "size-9 shrink-0 rounded-xl",
            isRecording && "ring-2 ring-inset ring-red-500/40",
          )}
          aria-pressed={isRecording}
          aria-label={
            isRecording
              ? t("wheelSpeakMicStopAria")
              : t("wheelSpeakMicStartAria")
          }
          onClick={() => void handleMicClick()}
        >
          {isRecording ? (
            <Square className="size-4" aria-hidden />
          ) : (
            <Mic className="size-4" aria-hidden />
          )}
        </Button>
        <div className="min-w-0 space-y-1 overflow-hidden">
          <p className="truncate font-mono text-sm font-semibold tabular-nums text-brand-900 dark:text-brand-100">
            {t("wheelSpeakTimer", {
              elapsed: elapsedLabel,
              required: requiredLabel,
            })}
          </p>
          <div
            className="box-border h-1.5 w-full max-w-full overflow-hidden rounded-full bg-brand-950/10 dark:bg-white/10"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("wheelSpeakTimerAria", {
              elapsed: elapsedLabel,
              required: requiredLabel,
            })}
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-200",
                requirementMet
                  ? "bg-emerald-500"
                  : isRecording
                    ? "bg-red-500"
                    : "bg-brand-800 dark:bg-brand-200",
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
