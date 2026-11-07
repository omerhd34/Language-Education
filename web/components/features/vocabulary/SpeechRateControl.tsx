"use client";

import { useTranslations } from "next-intl";
import { Check, Volume2 } from "lucide-react";
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

const RATE_HINT_KEYS = {
  0.3: "speechRateSlowHint",
  0.6: "speechRateMediumHint",
  0.9: "speechRateNormalHint",
  1.2: "speechRateFastHint",
  1.5: "speechRateFasterHint",
} as const;

type SpeechRateControlProps = {
  className?: string;
};

export function SpeechRateControl({ className }: SpeechRateControlProps) {
  const t = useTranslations("Settings");
  const { rate, setRate } = useSpeechRate();

  return (
    <ul
      className={cn("space-y-2", className)}
      role="group"
      aria-label={t("speechRateLabel")}
    >
      {SPEECH_RATE_PRESETS.map((preset) => {
        const selected = rate === preset;
        const label = t(RATE_LABEL_KEYS[preset]);
        return (
          <li key={preset}>
            <button
              type="button"
              aria-pressed={selected}
              aria-label={t("speechRatePreview", { rate: label })}
              onClick={() => {
                setRate(preset);
                speakText(t("speechRatePreviewSample"), "en-US", preset);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                selected
                  ? "border-sky-500/45 bg-sky-500/5 dark:border-sky-400/40 dark:bg-sky-400/10"
                  : "border-border bg-background/80 hover:border-sky-500/45 hover:bg-sky-500/5 dark:bg-brand-950/40",
              )}
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                <Volume2 className="size-3.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 space-y-0.5">
                <span className="block text-sm font-medium text-brand-950 dark:text-brand-100">
                  {label}
                </span>
                <span className="block text-xs leading-snug text-brand-600 dark:text-brand-400">
                  {t(RATE_HINT_KEYS[preset])}
                </span>
              </span>
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                  selected
                    ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
                    : "bg-brand-100 text-transparent dark:bg-brand-900",
                )}
                aria-hidden
              >
                <Check className="size-3.5" strokeWidth={2.5} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
