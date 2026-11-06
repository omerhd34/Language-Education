"use client";

import { useTranslations } from "next-intl";
import { Gauge, Volume2 } from "lucide-react";
import { useSpeechRate } from "@/hooks/useSpeechRate";
import {
  SPEECH_RATE_PRESETS,
  speakText,
  type SpeechRatePreset,
} from "@/lib/speakText";
import { cn } from "@/lib/utils";

const RATE_LABEL_KEYS = {
  0.3: "speechRateSlow",
  0.6: "speechRateMedium",
  0.9: "speechRateNormal",
  1.2: "speechRateFast",
  1.5: "speechRateFaster",
} as const satisfies Record<
  SpeechRatePreset,
  | "speechRateSlow"
  | "speechRateMedium"
  | "speechRateNormal"
  | "speechRateFast"
  | "speechRateFaster"
>;

type SpeechRateControlProps = {
  className?: string;
};

export function SpeechRateControl({ className }: SpeechRateControlProps) {
  const t = useTranslations("Settings");
  const { rate, setRate } = useSpeechRate();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border border-brand-200/70 bg-white/80 px-3 py-2 dark:border-brand-800/70 dark:bg-brand-950/40",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-300">
        <Gauge className="size-3.5" aria-hidden />
        {t("speechRateLabel")}
      </span>
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label={t("speechRateLabel")}
      >
        {SPEECH_RATE_PRESETS.map((preset) => {
          const selected = rate === preset;
          const label = t(RATE_LABEL_KEYS[preset]);
          return (
            <span
              key={preset}
              className={cn(
                "inline-flex items-stretch overflow-hidden rounded-full",
                selected
                  ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
                  : "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200",
              )}
            >
              <button
                type="button"
                onClick={() => setRate(preset)}
                aria-pressed={selected}
                className={cn(
                  "cursor-pointer px-2.5 py-1.5 text-xs font-medium transition-colors",
                  selected
                    ? "hover:bg-white/10"
                    : "hover:bg-sky-500/15 hover:text-sky-800 dark:hover:bg-sky-400/20 dark:hover:text-sky-100",
                )}
              >
                {label}
              </button>
              <button
                type="button"
                onClick={() =>
                  speakText(t("speechRatePreviewSample"), "en-US", preset)
                }
                aria-label={t("speechRatePreview", { rate: label })}
                className={cn(
                  "cursor-pointer border-l px-1.5 transition-colors",
                  selected
                    ? "border-white/30 hover:bg-white/15 dark:border-sky-950/25"
                    : "border-brand-300/80 hover:bg-sky-500/15 hover:text-sky-800 dark:border-brand-700 dark:hover:bg-sky-400/20 dark:hover:text-sky-100",
                )}
              >
                <Volume2 className="size-3.5" aria-hidden />
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
